import { NextResponse } from "next/server"
import { classesAPI } from "@/lib/database"

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0]
    const classes = await classesAPI.getAll()

    // Filter classes for today
    const todayClasses = classes.filter(
      (classItem) => classItem.class_date === today && classItem.status === "scheduled",
    )

    return NextResponse.json(todayClasses)
  } catch (error) {
    console.error("Error fetching today's schedule:", error)
    return NextResponse.json({ error: "Failed to fetch today's schedule" }, { status: 500 })
  }
}
