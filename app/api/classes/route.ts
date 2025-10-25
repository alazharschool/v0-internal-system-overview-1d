import { classesAPI, type Class } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const classes = await classesAPI.getAll()
    return NextResponse.json(classes, { status: 200 })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Class, "id" | "created_at" | "updated_at"> = await request.json()

    // Validate required fields
    if (!body.student_id || !body.teacher_id || !body.subject || !body.class_date || !body.start_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const classItem = await classesAPI.create(body)

    if (!classItem) {
      return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
    }

    return NextResponse.json(classItem, { status: 201 })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
