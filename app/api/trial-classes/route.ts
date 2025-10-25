import { trialClassesAPI, type TrialClass } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const trialClasses = await trialClassesAPI.getAll()
    return NextResponse.json(trialClasses || [], { status: 200 })
  } catch (error) {
    console.error("Error fetching trial classes:", error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<TrialClass, "id"> = await request.json()

    // Validate required fields
    if (!body.student_name || !body.student_email || !body.student_phone || !body.subject || !body.date || !body.time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const trialClass = await trialClassesAPI.create(body)

    if (!trialClass) {
      return NextResponse.json({ error: "Failed to create trial class" }, { status: 500 })
    }

    return NextResponse.json(trialClass, { status: 201 })
  } catch (error) {
    console.error("Error creating trial class:", error)
    return NextResponse.json({ error: "Failed to create trial class" }, { status: 500 })
  }
}
