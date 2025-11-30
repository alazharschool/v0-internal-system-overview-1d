export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  teacher_id: string
  study_days: string[]
  study_time: string
  lesson_duration: number
  monthly_payment: number
  payment_status: "paid" | "unpaid" | "pending"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  country: string
  hourly_rate: number
  monthly_salary?: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  student_id: string
  teacher_id: string
  lesson_date: string
  start_time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  lesson_id: string
  student_id: string
  status: "present" | "absent" | "no_lesson"
  date: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  student_id: string
  month: string
  amount: number
  status: "paid" | "unpaid" | "overdue"
  due_date: string
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  student_id: string
  completion_date: string
  certificate_data: Json
  pdf_url?: string
  created_at: string
  updated_at: string
}
