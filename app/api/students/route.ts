import { studentsAPI, type Student } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const students = await studentsAPI.getAll()
    return NextResponse.json(students, { status: 200 })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Student, "id" | "created_at" | "updated_at"> = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing required fields: name, email, phone" }, { status: 400 })
    }

    const student = await studentsAPI.create(body)

    if (!student) {
      return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
    }

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
