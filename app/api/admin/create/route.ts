import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const serviceRoleKey = request.headers.get("X-Service-Role-Key") || process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Service Role Key not provided. Please provide it in the X-Service-Role-Key header or set SUPABASE_SERVICE_ROLE_KEY environment variable.",
        },
        { status: 400 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL is not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const adminEmail = "admin@alazhar.school"
    const adminPassword = "mbanora1983"

    // First, check if admin already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error("[v0] Error listing users:", listError)
      return NextResponse.json({ error: "Failed to check existing users: " + listError.message }, { status: 500 })
    }

    const adminExists = existingUsers?.users?.some((u) => u.email === adminEmail)

    if (adminExists) {
      return NextResponse.json({ message: "Admin user already exists", email: adminEmail }, { status: 200 })
    }

    // Create admin user with service role key
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: "admin",
        is_admin: true,
      },
    })

    if (error) {
      console.error("[v0] Error creating admin user:", error)
      return NextResponse.json({ error: "Failed to create admin user: " + error.message }, { status: 500 })
    }

    console.log("[v0] Admin user created successfully:", data.user?.email)

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: {
          email: data.user?.email,
          id: data.user?.id,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "POST to this endpoint to create admin user",
      usage: "POST /api/admin/create with X-Service-Role-Key header",
    },
    { status: 200 },
  )
}
