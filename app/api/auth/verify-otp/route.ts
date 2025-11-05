import { type NextRequest, NextResponse } from "next/server"
import { verifyOTPWithPrisma } from "@/lib/authServicePrisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, otp } = body

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: "Identifier and OTP are required" },
        { status: 400 }
      )
    }

    const result = await verifyOTPWithPrisma(identifier, otp)

    return NextResponse.json({
      success: result.success,
      resetToken: result.resetToken,
      message: result.message
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invalid OTP" },
      { status: 400 }
    )
  }
}
