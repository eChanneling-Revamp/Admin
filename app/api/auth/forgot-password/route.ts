import { type NextRequest, NextResponse } from "next/server"
import { requestPasswordResetWithPrisma } from "@/lib/authServicePrisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier } = body

    if (!identifier) {
      return NextResponse.json(
        { error: "Email, username, or phone is required" },
        { status: 400 }
      )
    }

    const result = await requestPasswordResetWithPrisma(identifier)

    return NextResponse.json({
      success: result.success,
      message: result.message
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    )
  }
}
