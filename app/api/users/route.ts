// app/api/users/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"  // your Prisma client
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/users error', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Derive a username if not provided (use email prefix)
    const username = body.username || (typeof body.email === 'string' ? body.email.split('@')[0] : undefined)

    // Hash password before saving
    const hashed = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        username: username,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        role: body.role || 'user',
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
