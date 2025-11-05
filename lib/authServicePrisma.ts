import prisma from './prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from './jwt'

interface LoginCredentials {
  username: string
  password: string
  twoFA: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    name: string
    role: string
    email: string
    username: string
  }
  error?: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  name: string
  role?: string
  phone?: string
}

interface PasswordResetResponse {
  success: boolean
  message: string
}

interface VerifyOTPResponse {
  success: boolean
  resetToken: string
  message: string
}

// Login with Prisma and bcrypt
export async function loginWithPrisma(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const { username, password, twoFA } = credentials

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ],
        isActive: true
      }
    })

    if (!user) {
      return {
        success: false,
        error: "Invalid credentials"
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid credentials"
      }
    }

    // Verify 2FA if enabled
    if (user.twoFAEnabled) {
      // TODO: Implement proper 2FA verification with authenticator app
      // For now, using simple check
      if (twoFA !== '123456') {
        return {
          success: false,
          error: "Invalid 2FA code"
        }
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    // Create session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        username: user.username
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: "An error occurred during login"
    }
  }
}

// Register new user
export async function registerUser(data: RegisterData): Promise<LoginResponse> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email }
        ]
      }
    })

    if (existingUser) {
      return {
        success: false,
        error: "Username or email already exists"
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'user',
        phone: data.phone
      }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        username: user.username
      }
    }
  } catch (error) {
    console.error('Register error:', error)
    return {
      success: false,
      error: "An error occurred during registration"
    }
  }
}

// Request password reset
export async function requestPasswordResetWithPrisma(identifier: string): Promise<PasswordResetResponse> {
  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone: identifier }
        ],
        isActive: true
      }
    })

    if (!user) {
      // Don't reveal if user exists
      return {
        success: true,
        message: "If an account exists, an OTP has been sent"
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Generate reset token
    const resetToken = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })

    // Create password reset request
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        otp: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    })

    // TODO: Send OTP via email or SMS
    console.log(`OTP for ${user.email}: ${otp}`)

    return {
      success: true,
      message: "OTP sent successfully to your registered email/phone"
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return {
      success: false,
      message: "An error occurred. Please try again."
    }
  }
}

// Verify OTP
export async function verifyOTPWithPrisma(identifier: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    // Find user
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone: identifier }
        ]
      }
    })

    if (!user) {
      throw new Error("Invalid OTP")
    }

    // Find valid password reset request
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        otp: otp,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!resetRequest) {
      throw new Error("Invalid or expired OTP")
    }

    return {
      success: true,
      resetToken: resetRequest.token,
      message: "OTP verified successfully"
    }
  } catch (error) {
    throw new Error("Invalid OTP. Please try again.")
  }
}

// Reset password
export async function resetPasswordWithPrisma(resetToken: string, newPassword: string): Promise<PasswordResetResponse> {
  try {
    // Find valid password reset request
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        token: resetToken,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!resetRequest) {
      return {
        success: false,
        message: "Invalid or expired reset token"
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword }
    })

    // Mark reset request as used
    await prisma.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true }
    })

    // Invalidate all existing sessions
    await prisma.session.deleteMany({
      where: { userId: resetRequest.userId }
    })

    return {
      success: true,
      message: "Password reset successfully"
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      message: "An error occurred. Please try again."
    }
  }
}

// Logout (invalidate session)
export async function logout(token: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: { token: token }
    })
    return true
  } catch (error) {
    return false
  }
}

// Verify session token
export async function verifySession(token: string): Promise<boolean> {
  try {
    const session = await prisma.session.findUnique({
      where: {
        token: token,
        expiresAt: {
          gt: new Date()
        }
      }
    })
    return !!session
  } catch (error) {
    return false
  }
}
