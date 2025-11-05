import { type NextRequest, NextResponse } from "next/server"
import { loginWithPrisma } from "@/lib/authServicePrisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, twoFA } = body

    // Validate input
    if (!username || !password || !twoFA) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Authenticate user with Prisma
    const result = await loginWithPrisma({ username, password, twoFA })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Authentication failed" },
        { status: 401 }
      )
    }

    // Return success with token and user data
    return NextResponse.json({
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    )
  }
}
