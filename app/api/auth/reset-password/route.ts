import { type NextRequest, NextResponse } from "next/server"
import { resetPasswordWithPrisma } from "@/lib/authServicePrisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resetToken, newPassword } = body

    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { error: "Reset token and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const result = await resetPasswordWithPrisma(resetToken, newPassword)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: result.success,
      message: result.message
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    )
  }
}
