import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // ✅ صفحات مسموح لها تعدي بدون تحقق
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin-setup") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/setup-wizard") ||
    pathname.startsWith("/api/admin/create")
  ) {
    return NextResponse.next()
  }

  // ✅ باقي الموقع
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
