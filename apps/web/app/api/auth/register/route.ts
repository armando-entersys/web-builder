import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface User {
  id: string
  email: string
  name: string | null
  password: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const newUsers = await query<User>(
      `INSERT INTO users (email, password, name, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email, name, role`,
      [email, hashedPassword, name || null, "USER"]
    )

    const user = newUsers[0]

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
