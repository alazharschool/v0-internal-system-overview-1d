import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// محاكاة جلسة المستخدم
function getFakeUser(req: NextRequest) {
  // لو فيه كوكي باسم "fake_user" نعتبر المستخدم مسجّل دخول
  const userCookie = req.cookies.get("fake_user");
  if (userCookie) {
    return { id: "123", name: "Test User" };
  }
  return null;
}

export function middleware(req: NextRequest) {
  const user = getFakeUser(req);

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
  ];

  const isProtectedPath = protectedPaths.some(
    (path) =>
      req.nextUrl.pathname === path ||
      req.nextUrl.pathname.startsWith(path + "/")
  );

  // إعادة التوجيه إذا لم يكن المستخدم مسجّل الدخول
  if (isProtectedPath && !user && req.nextUrl.pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // إعادة التوجيه إذا المستخدم مسجّل الدخول وحاول الدخول لصفحة login
  if (req.nextUrl.pathname === "/login" && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // كل المسارات تقريبا باستثناء الملفات الثابتة والصور والفافيكون
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
