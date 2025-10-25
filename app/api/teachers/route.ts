import { teachersAPI, type Teacher } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const teachers = await teachersAPI.getAll()
    return NextResponse.json(teachers, { status: 200 })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Teacher, "id" | "created_at" | "updated_at"> = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.subject || !body.hourly_rate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const teacher = await teachersAPI.create(body)

    if (!teacher) {
      return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
    }

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}
