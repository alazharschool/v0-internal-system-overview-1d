import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/students",
  "/teachers",
  "/classes",
  "/payments",
  "/trial-lessons",
  "/certificates",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Redirect to login if accessing protected routes without token
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if accessing login with valid token
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
