import { classesAPI, type Class } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const classItem = await classesAPI.getById(params.id)

    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classItem, { status: 200 })
  } catch (error) {
    console.error("Error fetching class:", error)
    return NextResponse.json({ error: "Failed to fetch class" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: Partial<Class> = await request.json()

    const classItem = await classesAPI.update(params.id, body)

    if (!classItem) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classItem, { status: 200 })
  } catch (error) {
    console.error("Error updating class:", error)
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await classesAPI.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
    }

    return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting class:", error)
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
  }
}
