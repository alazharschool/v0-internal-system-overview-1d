"use server"

import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

/**
 * إنشاء Supabase Server Client
 */
function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: cookieStore.get,
        set: cookieStore.set,
        remove: cookieStore.delete,
      },
    }
  )
}

/**
 * تسجيل دخول الأدمن
 */
export async function signInAdmin(email: string, password: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { success: false, error: "بيانات الدخول غير صحيحة" }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut()
    return { success: false, error: "غير مصرح لك بالدخول" }
  }

  return { success: true }
}

/**
 * تسجيل خروج الأدمن
 */
export async function signOutAdmin() {
  const supabase = getSupabase()
  await supabase.auth.signOut()
  return { success: true }
}

/**
 * التحقق من جلسة الأدمن
 */
export async function getAdminSession() {
  const supabase = getSupabase()

  const { data } = await supabase.auth.getUser()
  if (!data.user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profile?.role !== "admin") return null

  return data.user
}
