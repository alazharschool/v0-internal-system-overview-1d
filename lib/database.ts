import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Student = {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  grade?: string
  subject?: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  address?: string
  status: "active" | "inactive" | "graduated"
  enrollment_date?: string
  notes?: string
  created_at?: string
}

export type Teacher = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  subjects?: string[]
  hourly_rate: number
  join_date: string
  status: "active" | "inactive"
  bio?: string
  zoom_link?: string
  created_at?: string
}

export type Class = {
  id: string
  student_id: string
  teacher_id: string
  student?: Student
  teacher?: Teacher
  subject: string
  class_date: string
  start_time: string
  end_time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  created_at?: string
}

export type TrialClass = {
  id: string
  student_name: string
  email: string
  phone: string
  teacher_id?: string
  subject: string
  trial_date: string
  start_time: string
  end_time: string
  duration: number
  status: "pending" | "scheduled" | "completed" | "cancelled"
  notes?: string
  created_at?: string
}

// Students API
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

  async create(student: Omit<Student, "id" | "created_at">): Promise<Student | null> {
    try {
      const { data, error } = await supabase.from("students").insert([student]).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating student:", error)
      return null
    }
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating student:", error)
      return null
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

// Teachers API
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

  async create(teacher: Omit<Teacher, "id" | "created_at">): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase.from("teachers").insert([teacher]).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating teacher:", error)
      return null
    }
  },

  async update(id: string, updates: Partial<Teacher>): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase.from("teachers").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating teacher:", error)
      return null
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

// Classes API
export const classesAPI = {
  async getAll(): Promise<Class[]> {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(
          `
        *,
        student:students(id, name, email, phone),
        teacher:teachers(id, name, email, phone)
      `,
        )
        .order("class_date", { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching classes:", error)
      return []
    }
  },

  async getById(id: string): Promise<Class | null> {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(
          `
        *,
        student:students(id, name, email, phone),
        teacher:teachers(id, name, email, phone)
      `,
        )
        .eq("id", id)
        .single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching class:", error)
      return null
    }
  },

  async create(classData: Omit<Class, "id" | "created_at" | "student" | "teacher">): Promise<Class | null> {
    try {
      const { data, error } = await supabase.from("classes").insert([classData]).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating class:", error)
      return null
    }
  },

  async update(id: string, updates: Partial<Class>): Promise<Class | null> {
    try {
      const { data, error } = await supabase.from("classes").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating class:", error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("classes").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting class:", error)
      return false
    }
  },
}

// Trial Classes API
export const trialClassesAPI = {
  async getAll(): Promise<TrialClass[]> {
    try {
      const { data, error } = await supabase.from("trial_classes").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching trial classes:", error)
      return []
    }
  },

  async getById(id: string): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase.from("trial_classes").select("*").eq("id", id).single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching trial class:", error)
      return null
    }
  },

  async create(trialClass: Omit<TrialClass, "id" | "created_at">): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase.from("trial_classes").insert([trialClass]).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating trial class:", error)
      return null
    }
  },

  async update(id: string, updates: Partial<TrialClass>): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase.from("trial_classes").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating trial class:", error)
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("trial_classes").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting trial class:", error)
      return false
    }
  },
}

export default supabase
export const dashboardAPI = {
  getStudents: async () => {
    // مثال: هنا تحط الكود اللي بيجيب الطلاب
    return await fetch('/api/students').then(res => res.json());
  },

  addStudent: async (data: any) => {
    return await fetch('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
  },
};
