import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: Request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        {
          success: false,
          message: "Missing Supabase credentials",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to fetch from a table to verify connection
    const { count, error } = await supabase.from("students").select("*", { count: "exact", head: true })

    if (error) {
      return Response.json(
        {
          success: false,
          message: "Database connection failed",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      message: "Database connection successful",
      studentsCount: count || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
