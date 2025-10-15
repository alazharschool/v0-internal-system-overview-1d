import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.includes("supabase.co"))

if (typeof window === "undefined") {
  console.log("🔧 Supabase Configuration:")
  console.log("📡 URL:", supabaseUrl)
  console.log("🔑 Key:", supabaseAnonKey?.substring(0, 20) + "...")
  console.log("✅ Status:", isSupabaseConfigured ? "Connected" : "Not Connected")
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  grade: string
  subject: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  address?: string
  status: "active" | "inactive" | "graduated"
  enrollment_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  subjects: string[]
  hourly_rate: number
  join_date: string
  status: "active" | "inactive"
  bio?: string
  zoom_link?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  class_date: string
  start_time: string
  end_time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  created_at: string
  updated_at: string
}

export interface TrialClass {
  id: string
  student_name: string
  student_email: string
  student_phone: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  teacher_id: string
  subject: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  outcome?: "pending" | "enrolled" | "declined"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  start_date: string
  end_date: string
  total_classes: number
  completed_classes: number
  remaining_classes: number
  progress_percentage: number
  monthly_fee: number
  status: "active" | "completed" | "paused"
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  currency: string
  payment_date: string
  payment_method: string
  status: "paid" | "pending" | "failed"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  student_id: string
  course_id: string
  certificate_type: string
  issue_date: string
  certificate_url?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id?: string
  action_type: string
  description: string
  metadata?: Record<string, any>
  created_at: string
}

export function handleSupabaseError(error: any) {
  console.error("Supabase Error:", error)
  return {
    success: false,
    error: error.message || "An error occurred",
  }
}

export async function checkTablesExist() {
  try {
    const tables = [
      "students",
      "teachers",
      "classes",
      "trial_classes",
      "courses",
      "payments",
      "certificates",
      "activities",
    ]
    const results: Record<string, boolean> = {}

    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1)
      results[table] = !error
    }

    return results
  } catch (error) {
    console.error("Error checking tables:", error)
    return {}
  }
}
