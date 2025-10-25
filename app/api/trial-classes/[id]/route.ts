import { trialClassesAPI, type TrialClass } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trialClass = await trialClassesAPI.getById(params.id)

    if (!trialClass) {
      return NextResponse.json({ error: "Trial class not found" }, { status: 404 })
    }

    return NextResponse.json(trialClass, { status: 200 })
  } catch (error) {
    console.error("Error fetching trial class:", error)
    return NextResponse.json({ error: "Failed to fetch trial class" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: Partial<TrialClass> = await request.json()

    const trialClass = await trialClassesAPI.update(params.id, body)

    if (!trialClass) {
      return NextResponse.json({ error: "Trial class not found" }, { status: 404 })
    }

    return NextResponse.json(trialClass, { status: 200 })
  } catch (error) {
    console.error("Error updating trial class:", error)
    return NextResponse.json({ error: "Failed to update trial class" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await trialClassesAPI.delete(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete trial class" }, { status: 500 })
    }

    return NextResponse.json({ message: "Trial class deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting trial class:", error)
    return NextResponse.json({ error: "Failed to delete trial class" }, { status: 500 })
  }
}
