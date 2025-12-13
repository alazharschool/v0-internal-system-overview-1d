import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  // 1️⃣ التحقق من تسجيل الدخول
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 2️⃣ المسارات المحمية
  const protectedRoutes = [
    "/",
    "/dashboard",
    "/students",
    "/teachers",
    "/classes",
    "/schedule",
    "/payments",
    "/certificates",
    "/admin",
  ]

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // 3️⃣ جلب الدور من profiles
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.redirect(new URL("/auth/error", req.url))
    }

    const role = profile.role

    // 4️⃣ مسارات خاصة بالأدمن فقط
    const adminOnlyRoutes = [
      "/teachers",
      "/payments",
      "/certificates",
      "/admin",
    ]

    const isAdminRoute = adminOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
