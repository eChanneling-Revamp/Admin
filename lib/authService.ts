interface LoginCredentials {
  username: string
  password: string
  twoFA: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    name: string
    role: string
    email?: string
  }
  error?: string
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

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    // Use the new Prisma-based auth API endpoint
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Login failed",
      }
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    }
  }
}

export async function requestPasswordReset(identifier: string): Promise<PasswordResetResponse> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier }),
    })

    const data = await response.json()

    return {
      success: data.success || false,
      message: data.message || "Failed to send OTP. Please try again.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    }
  }
}

export async function verifyOTP(identifier: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, otp }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Invalid OTP")
    }

    return {
      success: data.success,
      resetToken: data.resetToken,
      message: data.message,
    }
  } catch (error: any) {
    throw new Error(error.message || "Invalid OTP. Please try again.")
  }
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<PasswordResetResponse> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resetToken, newPassword }),
    })

    const data = await response.json()

    return {
      success: data.success || false,
      message: data.message || "Failed to reset password. Please try again.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password. Please try again.",
    }
  }
}
