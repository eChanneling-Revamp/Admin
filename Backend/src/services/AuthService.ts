import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { prisma } from '@/config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/config/jwt';
import { sendEmail, emailTemplates } from '@/config/mailer';
import { sendMessage, TOPICS } from '@/config/kafka';
import { logger } from '@/config/logger';
import { AuditService } from './AuditService';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '@/types/auth';

export class AuthService {
  private auditService = new AuditService();

  async login(loginData: LoginRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tokenId: crypto.randomUUID(),
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Log audit
    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN',
      description: 'User logged in successfully',
      ipAddress,
      userAgent,
    });

    // Send Kafka message
    try {
      await sendMessage(TOPICS.USER_UPDATED, {
        userId: user.id,
        action: 'LOGIN',
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to send Kafka message:', error);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(registerData: RegisterRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password, firstName, lastName, role = UserRole.PATIENT } = registerData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tokenId: crypto.randomUUID(),
    });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Log audit
    await this.auditService.log({
      userId: user.id,
      action: 'REGISTER',
      description: 'User registered successfully',
      ipAddress,
      userAgent,
    });

    // Send welcome email
    try {
      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
      await sendEmail({
        to: user.email,
        subject: emailTemplates.welcome(user.firstName || 'User', loginUrl).subject,
        html: emailTemplates.welcome(user.firstName || 'User', loginUrl).html,
      });
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
    }

    // Send Kafka message
    try {
      await sendMessage(TOPICS.USER_CREATED, {
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to send Kafka message:', error);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshData: RefreshTokenRequest): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshData;

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || !storedToken.user) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new Error('Refresh token expired');
    }

    if (!storedToken.user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate new access token
    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async logoutAll(userId: string): Promise<void> {
    // Delete all refresh tokens for user
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async forgotPassword(forgotData: ForgotPasswordRequest): Promise<void> {
    const { email } = forgotData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token (you might want to create a separate table for this)
    // For now, we'll use a simple approach with user metadata
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // You might want to add resetToken and resetExpires fields to User model
      },
    });

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: emailTemplates.passwordReset(user.firstName || 'User', resetUrl).subject,
      html: emailTemplates.passwordReset(user.firstName || 'User', resetUrl).html,
    });

    // Log audit
    await this.auditService.log({
      userId: user.id,
      action: 'FORGOT_PASSWORD',
      description: 'Password reset requested',
    });
  }

  async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    const { token, password } = resetData;

    // In a real implementation, you would verify the reset token
    // and check its expiration. For now, we'll skip this validation.

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password (you would need to find user by reset token)
    // This is a simplified implementation
    throw new Error('Reset password functionality needs proper token validation implementation');
  }

  async changePassword(
    userId: string,
    changeData: ChangePasswordRequest,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const { currentPassword, newPassword } = changeData;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Logout all sessions
    await this.logoutAll(userId);

    // Log audit
    await this.auditService.log({
      userId,
      action: 'CHANGE_PASSWORD',
      description: 'Password changed successfully',
      ipAddress,
      userAgent,
    });
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string; role: string }> {
    const decoded = verifyRefreshToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid token');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

export default new AuthService();
