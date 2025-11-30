import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseKey)

// ===========================
// TYPE DEFINITIONS
// ===========================

export interface Student {
  id: string
  name: string
  email: string
  assigned_teacher: string
  study_days: string[]
  study_time: string
  lesson_duration: number
  monthly_payments: number
  custom_notes?: string
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
  assigned_students?: string[]
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
  attendance: "present" | "absent" | "no_lesson"
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  lesson_id: string
  student_id: string
  date: string
  status: "present" | "absent" | "no_lesson"
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
  certificate_template: Record<string, any>
  pdf_url?: string
  created_at: string
  updated_at: string
}

// ===========================
// STUDENTS API
// ===========================
export const studentsAPI = {
  async getAll(): Promise<Student[]> {
    try {
      const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching students:", error)
      return []
    }
  },

  async getById(id: string): Promise<Student | null> {
    try {
      const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching student:", error)
      return null
    }
  },

  async create(student: Omit<Student, "id" | "created_at" | "updated_at">): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from("students")
        .insert([
          {
            ...student,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating student:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from("students")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating student:", error)
      throw error
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting student:", error)
      return false
    }
  },
}

// ===========================
// TEACHERS API
// ===========================
export const teachersAPI = {
  async getAll(): Promise<Teacher[]> {
    try {
      const { data, error } = await supabase.from("teachers").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching teachers:", error)
      return []
    }
  },

  async getById(id: string): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase.from("teachers").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching teacher:", error)
      return null
    }
  },

  async create(teacher: Omit<Teacher, "id" | "created_at" | "updated_at">): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase
        .from("teachers")
        .insert([
          {
            ...teacher,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating teacher:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Teacher>): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase
        .from("teachers")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating teacher:", error)
      throw error
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("teachers").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting teacher:", error)
      return false
    }
  },
}

// ===========================
// LESSONS API
// ===========================
export const lessonsAPI = {
  async getAll(): Promise<Lesson[]> {
    try {
      const { data, error } = await supabase.from("lessons").select("*").order("lesson_date", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching lessons:", error)
      return []
    }
  },

  async getTodayLessons(): Promise<Lesson[]> {
    try {
      const today = new Date().toISOString().split("T")[0]
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("lesson_date", today)
        .order("start_time", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching today's lessons:", error)
      return []
    }
  },

  async create(lesson: Omit<Lesson, "id" | "created_at" | "updated_at">): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .insert([
          {
            ...lesson,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating lesson:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating lesson:", error)
      throw error
    }
  },
}

// ===========================
// ATTENDANCE API
// ===========================
export const attendanceAPI = {
  async getByStudent(studentId: string, month: string): Promise<Attendance[]> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .like("date", `${month}%`)
        .order("date", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching attendance:", error)
      return []
    }
  },

  async update(id: string, status: "present" | "absent" | "no_lesson"): Promise<Attendance | null> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating attendance:", error)
      throw error
    }
  },
}

// ===========================
// INVOICES API
// ===========================
export const invoicesAPI = {
  async getByStudent(studentId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("student_id", studentId)
        .order("month", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching invoices:", error)
      return []
    }
  },

  async create(invoice: Omit<Invoice, "id" | "created_at" | "updated_at">): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert([
          {
            ...invoice,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating invoice:", error)
      throw error
    }
  },

  async updateStatus(id: string, status: "paid" | "unpaid" | "overdue"): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating invoice:", error)
      throw error
    }
  },
}

// ===========================
// CERTIFICATES API
// ===========================
export const certificatesAPI = {
  async getByStudent(studentId: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", studentId)
        .order("completion_date", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching certificates:", error)
      return []
    }
  },

  async create(certificate: Omit<Certificate, "id" | "created_at" | "updated_at">): Promise<Certificate | null> {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .insert([
          {
            ...certificate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating certificate:", error)
      throw error
    }
  },
}
