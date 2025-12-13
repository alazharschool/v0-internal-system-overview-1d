import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // الرد الافتراضي
  let supabaseResponse = NextResponse.next({ request })

  // إنشاء عميل Supabase باستخدام المتغيرات البيئية فقط
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: لا تضع أي كود بين createServerClient و supabase.auth.getUser()
  const { data: { user } } = await supabase.auth.getUser()

  // المسارات المحمية
  const protectedPaths = [
    "/",
    "/students",
    "/teachers",
    "/classes",
    "/schedule",
    "/payments",
    "/certificates",
    "/trial-classes",
  ]
  const isProtectedPath = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/")
  )

  // إعادة التوجيه إذا لم يكن المستخدم مسجّل الدخول
  if (isProtectedPath && !user && request.nextUrl.pathname !== "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // إعادة التوجيه إذا كان المستخدم مسجّل الدخول وحاول الدخول لصفحة login
  if (request.nextUrl.pathname === "/login" && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
