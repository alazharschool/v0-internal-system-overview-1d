import { NextResponse } from "next/server"
import { dashboardAPI } from "@/lib/database"

export async function GET() {
  try {
    const stats = await dashboardAPI.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
