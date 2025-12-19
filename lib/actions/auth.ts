"use server"

import { createClient } from "@/lib/supabase/server"

export async function signInAdmin(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return { success: false, error: "Invalid email or password" }
    }

    // ✅ تحقق حقيقي من قاعدة البيانات
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("id", data.user.id)
      .single()

    if (adminError || !admin) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: "Access denied. Admin account required.",
      }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Auth error:", error)
    return { success: false, error: "Authentication failed" }
  }
}
