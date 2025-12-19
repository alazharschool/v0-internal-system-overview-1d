"use server"

import { createClient } from "@/lib/supabase/server"

export async function signInAdmin(email: string, password: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] Supabase login error:", error.message)
      throw new Error(error.message)
    }

    // Check if the user is an admin via metadata or email
    const userRole = data.user?.user_metadata?.role || data.user?.user_metadata?.is_admin
    const isAdmin = userRole === "admin" || data.user?.email === "admin@alazhar.school"

    if (!isAdmin) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: "Access denied. Only administrators can sign in.",
      }
    }

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Auth error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Authentication failed" }
  }
}

export async function signOutAdmin() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false }
  }
}

export async function verifyAdminSession() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return { authenticated: false }

    const userRole = user.user_metadata?.role || user.user_metadata?.is_admin
    const isAdmin = userRole === "admin" || user.email === "admin@alazhar.school"

    return { authenticated: isAdmin, user }
  } catch (error) {
    console.error("Session verification error:", error)
    return { authenticated: false }
  }
}
