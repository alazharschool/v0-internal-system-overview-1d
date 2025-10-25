import { teachersAPI, type Teacher } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teacher = await teachersAPI.getById(params.id)

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(teacher, { status: 200 })
  } catch (error) {
    console.error("Error fetching teacher:", error)
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: Partial<Teacher> = await request.json()

    const teacher = await teachersAPI.update(params.id, body)

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(teacher, { status: 200 })
  } catch (error) {
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await teachersAPI.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
    }

    return NextResponse.json({ message: "Teacher deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
  }
}
