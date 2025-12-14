// lib/auth.ts
"use server"

import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function signInAdmin(email: string, password: string) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: cookieStore.get, set: cookieStore.set, remove: cookieStore.delete } }
  )

  // 1️⃣ تسجيل الدخول
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { success: false, error: "بيانات الدخول غير صحيحة" }
  }

  // 2️⃣ التأكد من أن الدور admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") {
    await supabase.auth.signOut()
    return { success: false, error: "غير مصرح لك بالدخول" }
  }

  return { success: true, user: data.user }
}

export async function signOutAdmin() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: cookieStore.get, set: cookieStore.set, remove: cookieStore.delete } }
  )

  await supabase.auth.signOut()
  return { success: true }
}

export async function getAdminSession() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: cookieStore.get } }
  )

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (!profile || profile.role !== "admin") return null

  return data.user
}
