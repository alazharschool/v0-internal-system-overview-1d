import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const serviceRoleKey =
      request.headers.get("x-service-role-key") ||
      process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Service Role Key is required" },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is missing" },
        { status: 500 }
      )
    }

    // ✅ أهم سطر
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const adminEmail = "admin@alazhar.school"
    const adminPassword = "mbanora1983"

    // 1️⃣ هل الأدمن موجود؟
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers()

    if (listError) {
      return NextResponse.json(
        { error: listError.message },
        { status: 500 }
      )
    }

    const exists = users.users.some(
      (u) => u.email === adminEmail
    )

    if (exists) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 200 }
      )
    }

    // 2️⃣ إنشاء الأدمن
    const { data, error } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          role: "admin",
        },
      })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        email: data.user?.email,
      },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    )
  }
}
