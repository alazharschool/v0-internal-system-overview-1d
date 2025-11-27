import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Student {
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
  updated_at?: string
  weekly_schedule?: Array<{
    day: string
    start_time: string
    end_time: string
    subject: string
  }>
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  subjects?: string[]
  hourly_rate: number
  status: "active" | "inactive"
  join_date: string
  bio?: string
  experience?: number
  zoom_link?: string
  created_at?: string
  updated_at?: string
}

export interface Class {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  class_date: string
  start_time: string
  end_time?: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  student?: { name: string; phone?: string }
  teacher?: { name: string; phone?: string }
  created_at?: string
  updated_at?: string
}

export interface TrialClass {
  id: string
  student_name: string
  student_email: string
  student_phone: string
  subject: string
  date: string
  time: string
  duration: number
  teacher_id?: string
  teacher?: { name: string }
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  outcome?: "pending" | "enrolled" | "declined"
  parent_name?: string
  parent_phone?: string
  notes?: string
}

export interface DashboardStats {
  total_students: number
  active_students: number
  total_teachers: number
  active_teachers: number
  total_classes: number
  today_classes: number
}

export interface Course {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  total_classes: number
  completed_classes: number
  remaining_classes: number
  start_date: string
  end_date: string
  status: "active" | "completed" | "paused"
  progress_percentage: number
  monthly_fee: number
  notes?: string
  student?: { name: string; email: string }
  teacher?: { name: string; hourly_rate: number }
  created_at?: string
  updated_at?: string
}

// ===========================
// STUDENTS API
// ===========================
export const studentsAPI = {
  async getAll(): Promise<Student[]> {
    try {
      const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching students:", error)
        return []
      }
      return data || []
    } catch (error) {
      console.error("Error fetching students:", error)
      return []
    }
  },

  async getById(id: string): Promise<Student | null> {
    try {
      const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

      if (error) {
        console.error("Supabase error fetching student:", error)
        return null
      }
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

      if (error) {
        console.error("Supabase error fetching teachers:", error)
        return []
      }

      return (
        data?.map((teacher: any) => ({
          ...teacher,
          subjects: teacher.subjects || (teacher.subject ? [teacher.subject] : []),
        })) || []
      )
    } catch (error) {
      console.error("Error fetching teachers:", error)
      return []
    }
  },

  async getById(id: string): Promise<Teacher | null> {
    try {
      const { data, error } = await supabase.from("teachers").select("*").eq("id", id).single()

      if (error) {
        console.error("Supabase error fetching teacher:", error)
        return null
      }

      return {
        ...data,
        subjects: data.subjects || (data.subject ? [data.subject] : []),
      }
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
// CLASSES API
// ===========================
export const classesAPI = {
  async getAll(): Promise<Class[]> {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(
          `
          *,
          student:students(id, name, phone),
          teacher:teachers(id, name, phone)
        `,
        )
        .order("class_date", { ascending: false })

      if (error) {
        console.error("Supabase error fetching classes:", error)
        return []
      }

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
          student:students(id, name, phone),
          teacher:teachers(id, name, phone)
        `,
        )
        .eq("id", id)
        .single()

      if (error) {
        console.error("Supabase error fetching class:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching class:", error)
      return null
    }
  },

  async getByStudentId(studentId: string): Promise<Class[]> {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select(
          `
          *,
          student:students(id, name, phone),
          teacher:teachers(id, name, phone)
        `,
        )
        .eq("student_id", studentId)
        .order("class_date", { ascending: false })

      if (error) {
        console.error("Supabase error fetching student classes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching student classes:", error)
      return []
    }
  },

  async create(classData: Omit<Class, "id" | "created_at" | "updated_at">): Promise<Class | null> {
    try {
      const { data, error } = await supabase
        .from("classes")
        .insert([
          {
            ...classData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating class:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Class>): Promise<Class | null> {
    try {
      const { data, error } = await supabase
        .from("classes")
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
      console.error("Error updating class:", error)
      throw error
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

// ===========================
// TRIAL CLASSES API
// ===========================
export const trialClassesAPI = {
  async getAll(): Promise<TrialClass[]> {
    try {
      const { data, error } = await supabase
        .from("trial_classes")
        .select("*, teacher:teachers(id, name)")
        .order("date", { ascending: false })

      if (error) {
        console.error("Supabase error fetching trial classes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching trial classes:", error)
      return []
    }
  },

  async getById(id: string): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase
        .from("trial_classes")
        .select("*, teacher:teachers(id, name)")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Supabase error fetching trial class:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching trial class:", error)
      return null
    }
  },

  async create(trialClass: Omit<TrialClass, "id">): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase.from("trial_classes").insert([trialClass]).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating trial class:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<TrialClass>): Promise<TrialClass | null> {
    try {
      const { data, error } = await supabase.from("trial_classes").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error updating trial class:", error)
      throw error
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

// ===========================
// COURSES API
// ===========================
export const coursesAPI = {
  async getAll(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          student:students(id, name, email),
          teacher:teachers(id, name, hourly_rate)
        `,
        )
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching courses:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching courses:", error)
      return []
    }
  },

  async getById(id: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          student:students(id, name, email),
          teacher:teachers(id, name, hourly_rate)
        `,
        )
        .eq("id", id)
        .single()

      if (error) {
        console.error("Supabase error fetching course:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching course:", error)
      return null
    }
  },

  async getByStudentId(studentId: string): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          student:students(id, name, email),
          teacher:teachers(id, name, hourly_rate)
        `,
        )
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error fetching student courses:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching student courses:", error)
      return []
    }
  },

  async create(courseData: Omit<Course, "id" | "created_at" | "updated_at">): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            ...courseData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating course:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Course>): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from("courses")
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
      console.error("Error updating course:", error)
      throw error
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting course:", error)
      return false
    }
  },
}

// ===========================
// DASHBOARD API
// ===========================
export const dashboardAPI = {
  async getStats(): Promise<DashboardStats> {
    try {
      const [studentsRes, teachersRes, classesRes] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("teachers").select("*", { count: "exact", head: true }),
        supabase.from("classes").select("*", { count: "exact", head: true }),
      ])

      const today = new Date().toISOString().split("T")[0]
      const { count: todayCount } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true })
        .eq("class_date", today)

      const { count: activeStudentsCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      const { count: activeTeachersCount } = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active")

      return {
        total_students: studentsRes.count || 0,
        active_students: activeStudentsCount || 0,
        total_teachers: teachersRes.count || 0,
        active_teachers: activeTeachersCount || 0,
        total_classes: classesRes.count || 0,
        today_classes: todayCount || 0,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        total_students: 0,
        active_students: 0,
        total_teachers: 0,
        active_teachers: 0,
        total_classes: 0,
        today_classes: 0,
      }
    }
  },
}
