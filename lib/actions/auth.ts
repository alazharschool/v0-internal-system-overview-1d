"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export async function signInAdmin(email: string, password: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)

    // Store session in cookies
    const cookieStore = await cookies()
    if (data.session) {
      cookieStore.set("auth-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Check if the user is an admin
    const userRole = data.user?.user_metadata?.role || data.user?.user_metadata?.is_admin
    const isAdmin = userRole === "admin" || data.user?.email === "admin@alazhar.school"

    if (!isAdmin) {
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
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")
    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false }
  }
}

export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) return { authenticated: false }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) return { authenticated: false }

    return { authenticated: true, user: data.user }
  } catch (error) {
    console.error("Session verification error:", error)
    return { authenticated: false }
  }
}
