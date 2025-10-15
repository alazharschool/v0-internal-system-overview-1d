import { createClient } from "@supabase/supabase-js"

// Types
export interface Student {
  id: string
  name: string
  email: string
  phone: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  age?: number
  grade: string
  subject: string
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

export interface DashboardStats {
  total_students: number
  active_students: number
  total_teachers: number
  active_teachers: number
  total_classes: number
  today_classes: number
  total_trial_classes: number
  pending_trial_classes: number
}

// Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

let supabase: ReturnType<typeof createClient> | null = null
let isSupabaseConfigured = false

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    isSupabaseConfigured = true
    console.log("🔧 Supabase Configuration:")
    console.log("📡 URL:", supabaseUrl)
    console.log("🔑 Key:", supabaseKey.substring(0, 20) + "...")
    console.log("✅ Status: Connected")
    console.log("🗄️ Database Mode: Supabase")
  } catch (error) {
    console.error("❌ Supabase initialization error:", error)
    supabase = null
    isSupabaseConfigured = false
  }
}

const useMockData = !isSupabaseConfigured

// Mock Data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Ahmed Mohamed Ali",
    email: "ahmed.ali@example.com",
    phone: "+20-100-123-4567",
    age: 15,
    grade: "Grade 10",
    subject: "Quran Memorization",
    parent_name: "Mohamed Ali",
    parent_phone: "+20-100-123-4568",
    parent_email: "mohamed.ali@example.com",
    address: "Cairo, Egypt (UTC+2)",
    status: "active",
    enrollment_date: "2024-01-15",
    notes: "Excellent student with strong memorization skills",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Fatima Abdullah",
    email: "fatima.abdullah@example.com",
    phone: "+966-555-123-4567",
    age: 14,
    grade: "Grade 9",
    subject: "Arabic Language",
    parent_name: "Abdullah Hassan",
    parent_phone: "+966-555-123-4568",
    parent_email: "abdullah.hassan@example.com",
    address: "Riyadh, Saudi Arabia (UTC+3)",
    status: "active",
    enrollment_date: "2024-02-01",
    notes: "Very attentive and participates actively",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Omar Hassan",
    email: "omar.hassan@example.com",
    phone: "+971-50-123-4567",
    age: 16,
    grade: "Grade 11",
    subject: "Islamic Studies",
    parent_name: "Hassan Ahmed",
    parent_phone: "+971-50-123-4568",
    parent_email: "hassan.ahmed@example.com",
    address: "Dubai, UAE (UTC+4)",
    status: "active",
    enrollment_date: "2024-01-20",
    notes: "Shows great interest in Islamic history",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Mohamed Abdelrahman",
    email: "mohamed.abdelrahman@alazhar.edu",
    phone: "+20-100-111-2222",
    subject: "Quran Memorization",
    subjects: ["Quran Memorization", "Tajweed", "Tafsir"],
    hourly_rate: 150,
    join_date: "2023-09-01",
    status: "active",
    bio: "Ph.D. in Quranic Sciences from Al-Azhar University with 15 years of teaching experience",
    zoom_link: "https://zoom.us/j/1234567890",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Prof. Aisha Ahmed",
    email: "aisha.ahmed@alazhar.edu",
    phone: "+20-100-222-3333",
    subject: "Arabic Language",
    subjects: ["Arabic Language", "Grammar", "Literature"],
    hourly_rate: 120,
    join_date: "2023-09-15",
    status: "active",
    bio: "Professor of Arabic Language with specialization in classical and modern literature",
    zoom_link: "https://zoom.us/j/2345678901",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@alazhar.edu",
    phone: "+20-100-333-4444",
    subject: "Islamic Studies",
    subjects: ["Islamic Studies", "Fiqh", "Aqeedah"],
    hourly_rate: 140,
    join_date: "2023-10-01",
    status: "active",
    bio: "Expert in Islamic jurisprudence and theology with international teaching experience",
    zoom_link: "https://zoom.us/j/3456789012",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const today = new Date().toISOString().split("T")[0]

const mockClasses: Class[] = [
  {
    id: "1",
    student_id: "1",
    teacher_id: "1",
    subject: "Quran Memorization",
    class_date: today,
    start_time: "09:00:00",
    end_time: "10:00:00",
    duration: 60,
    status: "scheduled",
    notes: "Review Surah Al-Baqarah verses 1-20",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_id: "2",
    teacher_id: "2",
    subject: "Arabic Language",
    class_date: today,
    start_time: "10:30:00",
    end_time: "11:30:00",
    duration: 60,
    status: "scheduled",
    notes: "Grammar lesson: Advanced verb conjugation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    student_id: "3",
    teacher_id: "3",
    subject: "Islamic Studies",
    class_date: today,
    start_time: "14:00:00",
    end_time: "15:00:00",
    duration: 60,
    status: "scheduled",
    notes: "Introduction to Fiqh principles and rulings",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockTrialClasses: TrialClass[] = [
  {
    id: "1",
    student_name: "Sarah Ahmed Ibrahim",
    student_email: "sarah.ahmed@example.com",
    student_phone: "+20-100-777-8888",
    parent_name: "Ahmed Ibrahim",
    parent_phone: "+20-100-777-8889",
    teacher_id: "1",
    subject: "Quran Memorization",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "16:00:00",
    duration: 30,
    status: "scheduled",
    outcome: "pending",
    notes: "First trial class - interested in Quran memorization program",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_name: "Ali Hassan Mohamed",
    student_email: "ali.hassan@example.com",
    student_phone: "+966-555-888-9999",
    parent_name: "Hassan Mohamed",
    parent_phone: "+966-555-888-9998",
    teacher_id: "2",
    subject: "Arabic Language",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    time: "17:00:00",
    duration: 30,
    status: "scheduled",
    outcome: "pending",
    notes: "Interested in improving Arabic grammar skills",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockCourses: Course[] = [
  {
    id: "1",
    student_id: "1",
    teacher_id: "1",
    subject: "Quran Memorization",
    start_date: "2024-01-15",
    end_date: "2024-12-15",
    total_classes: 48,
    completed_classes: 12,
    remaining_classes: 36,
    progress_percentage: 25,
    monthly_fee: 300,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    student_id: "2",
    teacher_id: "2",
    subject: "Arabic Language",
    start_date: "2024-02-01",
    end_date: "2024-11-30",
    total_classes: 40,
    completed_classes: 8,
    remaining_classes: 32,
    progress_percentage: 20,
    monthly_fee: 250,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Students API
export const studentsAPI = {
  getAll: async (): Promise<Student[]> => {
    await delay(300)
    if (useMockData || !supabase) {
      return mockStudents
    }

    try {
      const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching students from Supabase:", error)
        return mockStudents
      }

      return data || mockStudents
    } catch (error) {
      console.error("Error fetching students from Supabase:", error)
      return mockStudents
    }
  },

  getById: async (id: string): Promise<Student | null> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockStudents.find((s) => s.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("students").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching student from Supabase:", error)
        return mockStudents.find((s) => s.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error fetching student from Supabase:", error)
      return mockStudents.find((s) => s.id === id) || null
    }
  },

  create: async (student: Partial<Student>): Promise<Student | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const newStudent: Student = {
        id: String(mockStudents.length + 1),
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        grade: student.grade || "",
        subject: student.subject || "",
        status: student.status || "active",
        enrollment_date: student.enrollment_date || new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...student,
      }
      mockStudents.push(newStudent)
      return newStudent
    }

    try {
      const { data, error } = await supabase.from("students").insert([student]).select().single()

      if (error) {
        console.error("Error creating student in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating student in Supabase:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Student>): Promise<Student | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const index = mockStudents.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockStudents[index] = { ...mockStudents[index], ...updates, updated_at: new Date().toISOString() }
        return mockStudents[index]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating student in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error updating student in Supabase:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    if (useMockData || !supabase) {
      const index = mockStudents.findIndex((s) => s.id === id)
      if (index !== -1) {
        mockStudents.splice(index, 1)
        return true
      }
      return false
    }

    try {
      const { error } = await supabase.from("students").delete().eq("id", id)

      if (error) {
        console.error("Error deleting student from Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting student from Supabase:", error)
      return false
    }
  },
}

// Teachers API
export const teachersAPI = {
  getAll: async (): Promise<Teacher[]> => {
    await delay(300)
    if (useMockData || !supabase) {
      return mockTeachers
    }

    try {
      const { data, error } = await supabase.from("teachers").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching teachers from Supabase:", error)
        return mockTeachers
      }

      return data || mockTeachers
    } catch (error) {
      console.error("Error fetching teachers from Supabase:", error)
      return mockTeachers
    }
  },

  getById: async (id: string): Promise<Teacher | null> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockTeachers.find((t) => t.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("teachers").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching teacher from Supabase:", error)
        return mockTeachers.find((t) => t.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error fetching teacher from Supabase:", error)
      return mockTeachers.find((t) => t.id === id) || null
    }
  },

  create: async (teacher: Partial<Teacher>): Promise<Teacher | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const newTeacher: Teacher = {
        id: String(mockTeachers.length + 1),
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        subject: teacher.subject || "",
        subjects: teacher.subjects || [],
        hourly_rate: teacher.hourly_rate || 100,
        join_date: teacher.join_date || new Date().toISOString().split("T")[0],
        status: teacher.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...teacher,
      }
      mockTeachers.push(newTeacher)
      return newTeacher
    }

    try {
      const { data, error } = await supabase.from("teachers").insert([teacher]).select().single()

      if (error) {
        console.error("Error creating teacher in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating teacher in Supabase:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Teacher>): Promise<Teacher | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const index = mockTeachers.findIndex((t) => t.id === id)
      if (index !== -1) {
        mockTeachers[index] = { ...mockTeachers[index], ...updates, updated_at: new Date().toISOString() }
        return mockTeachers[index]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("teachers").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating teacher in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error updating teacher in Supabase:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    if (useMockData || !supabase) {
      const index = mockTeachers.findIndex((t) => t.id === id)
      if (index !== -1) {
        mockTeachers.splice(index, 1)
        return true
      }
      return false
    }

    try {
      const { error } = await supabase.from("teachers").delete().eq("id", id)

      if (error) {
        console.error("Error deleting teacher from Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting teacher from Supabase:", error)
      return false
    }
  },
}

// Classes API
export const classesAPI = {
  getAll: async (): Promise<Class[]> => {
    await delay(300)
    if (useMockData || !supabase) {
      return mockClasses
    }

    try {
      const { data, error } = await supabase.from("classes").select("*").order("class_date", { ascending: false })

      if (error) {
        console.error("Error fetching classes from Supabase:", error)
        return mockClasses
      }

      return data || mockClasses
    } catch (error) {
      console.error("Error fetching classes from Supabase:", error)
      return mockClasses
    }
  },

  getByStudentId: async (studentId: string): Promise<Class[]> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockClasses.filter((c) => c.student_id === studentId)
    }

    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("student_id", studentId)
        .order("class_date", { ascending: false })

      if (error) {
        console.error("Error fetching classes from Supabase:", error)
        return mockClasses.filter((c) => c.student_id === studentId)
      }

      return data || []
    } catch (error) {
      console.error("Error fetching classes from Supabase:", error)
      return mockClasses.filter((c) => c.student_id === studentId)
    }
  },

  getByTeacherId: async (teacherId: string): Promise<Class[]> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockClasses.filter((c) => c.teacher_id === teacherId)
    }

    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("class_date", { ascending: false })

      if (error) {
        console.error("Error fetching classes from Supabase:", error)
        return mockClasses.filter((c) => c.teacher_id === teacherId)
      }

      return data || []
    } catch (error) {
      console.error("Error fetching classes from Supabase:", error)
      return mockClasses.filter((c) => c.teacher_id === teacherId)
    }
  },

  getToday: async (): Promise<Class[]> => {
    await delay(200)
    const today = new Date().toISOString().split("T")[0]

    if (useMockData || !supabase) {
      return mockClasses.filter((c) => c.class_date === today)
    }

    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("class_date", today)
        .order("start_time", { ascending: true })

      if (error) {
        console.error("Error fetching today classes from Supabase:", error)
        return mockClasses.filter((c) => c.class_date === today)
      }

      return data || []
    } catch (error) {
      console.error("Error fetching today classes from Supabase:", error)
      return mockClasses.filter((c) => c.class_date === today)
    }
  },

  create: async (classData: Partial<Class>): Promise<Class | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const newClass: Class = {
        id: String(mockClasses.length + 1),
        student_id: classData.student_id || "",
        teacher_id: classData.teacher_id || "",
        subject: classData.subject || "",
        class_date: classData.class_date || new Date().toISOString().split("T")[0],
        start_time: classData.start_time || "09:00:00",
        end_time: classData.end_time || "10:00:00",
        duration: classData.duration || 60,
        status: classData.status || "scheduled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...classData,
      }
      mockClasses.push(newClass)
      return newClass
    }

    try {
      const { data, error } = await supabase.from("classes").insert([classData]).select().single()

      if (error) {
        console.error("Error creating class in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating class in Supabase:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Class>): Promise<Class | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const index = mockClasses.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockClasses[index] = { ...mockClasses[index], ...updates, updated_at: new Date().toISOString() }
        return mockClasses[index]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("classes").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating class in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error updating class in Supabase:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    if (useMockData || !supabase) {
      const index = mockClasses.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockClasses.splice(index, 1)
        return true
      }
      return false
    }

    try {
      const { error } = await supabase.from("classes").delete().eq("id", id)

      if (error) {
        console.error("Error deleting class from Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting class from Supabase:", error)
      return false
    }
  },
}

// Trial Classes API
export const trialClassesAPI = {
  getAll: async (): Promise<TrialClass[]> => {
    await delay(300)
    if (useMockData || !supabase) {
      return mockTrialClasses
    }

    try {
      const { data, error } = await supabase.from("trial_classes").select("*").order("date", { ascending: true })

      if (error) {
        console.error("Error fetching trial classes from Supabase:", error)
        return mockTrialClasses
      }

      return data || mockTrialClasses
    } catch (error) {
      console.error("Error fetching trial classes from Supabase:", error)
      return mockTrialClasses
    }
  },

  getById: async (id: string): Promise<TrialClass | null> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockTrialClasses.find((tc) => tc.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("trial_classes").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching trial class from Supabase:", error)
        return mockTrialClasses.find((tc) => tc.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error fetching trial class from Supabase:", error)
      return mockTrialClasses.find((tc) => tc.id === id) || null
    }
  },

  create: async (trialClass: Partial<TrialClass>): Promise<TrialClass | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const newTrialClass: TrialClass = {
        id: String(mockTrialClasses.length + 1),
        student_name: trialClass.student_name || "",
        student_email: trialClass.student_email || "",
        student_phone: trialClass.student_phone || "",
        teacher_id: trialClass.teacher_id || "",
        subject: trialClass.subject || "",
        date: trialClass.date || new Date().toISOString().split("T")[0],
        time: trialClass.time || "16:00:00",
        duration: trialClass.duration || 30,
        status: trialClass.status || "scheduled",
        outcome: trialClass.outcome || "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...trialClass,
      }
      mockTrialClasses.push(newTrialClass)
      return newTrialClass
    }

    try {
      const { data, error } = await supabase.from("trial_classes").insert([trialClass]).select().single()

      if (error) {
        console.error("Error creating trial class in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating trial class in Supabase:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<TrialClass>): Promise<TrialClass | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const index = mockTrialClasses.findIndex((tc) => tc.id === id)
      if (index !== -1) {
        mockTrialClasses[index] = { ...mockTrialClasses[index], ...updates, updated_at: new Date().toISOString() }
        return mockTrialClasses[index]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("trial_classes").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating trial class in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error updating trial class in Supabase:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    if (useMockData || !supabase) {
      const index = mockTrialClasses.findIndex((tc) => tc.id === id)
      if (index !== -1) {
        mockTrialClasses.splice(index, 1)
        return true
      }
      return false
    }

    try {
      const { error } = await supabase.from("trial_classes").delete().eq("id", id)

      if (error) {
        console.error("Error deleting trial class from Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting trial class from Supabase:", error)
      return false
    }
  },
}

// Courses API
export const coursesAPI = {
  getAll: async (): Promise<Course[]> => {
    await delay(300)
    if (useMockData || !supabase) {
      return mockCourses
    }

    try {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching courses from Supabase:", error)
        return mockCourses
      }

      return data || mockCourses
    } catch (error) {
      console.error("Error fetching courses from Supabase:", error)
      return mockCourses
    }
  },

  getById: async (id: string): Promise<Course | null> => {
    await delay(200)
    if (useMockData || !supabase) {
      return mockCourses.find((c) => c.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching course from Supabase:", error)
        return mockCourses.find((c) => c.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error fetching course from Supabase:", error)
      return mockCourses.find((c) => c.id === id) || null
    }
  },

  create: async (course: Partial<Course>): Promise<Course | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const newCourse: Course = {
        id: String(mockCourses.length + 1),
        student_id: course.student_id || "",
        teacher_id: course.teacher_id || "",
        subject: course.subject || "",
        start_date: course.start_date || new Date().toISOString().split("T")[0],
        end_date: course.end_date || "",
        total_classes: course.total_classes || 0,
        completed_classes: course.completed_classes || 0,
        remaining_classes: course.remaining_classes || 0,
        progress_percentage: course.progress_percentage || 0,
        monthly_fee: course.monthly_fee || 0,
        status: course.status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...course,
      }
      mockCourses.push(newCourse)
      return newCourse
    }

    try {
      const { data, error } = await supabase.from("courses").insert([course]).select().single()

      if (error) {
        console.error("Error creating course in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error creating course in Supabase:", error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Course>): Promise<Course | null> => {
    await delay(400)
    if (useMockData || !supabase) {
      const index = mockCourses.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCourses[index] = { ...mockCourses[index], ...updates, updated_at: new Date().toISOString() }
        return mockCourses[index]
      }
      return null
    }

    try {
      const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select().single()

      if (error) {
        console.error("Error updating course in Supabase:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error updating course in Supabase:", error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    if (useMockData || !supabase) {
      const index = mockCourses.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCourses.splice(index, 1)
        return true
      }
      return false
    }

    try {
      const { error } = await supabase.from("courses").delete().eq("id", id)

      if (error) {
        console.error("Error deleting course from Supabase:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error deleting course from Supabase:", error)
      return false
    }
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(300)

    if (useMockData || !supabase) {
      const today = new Date().toISOString().split("T")[0]
      return {
        total_students: mockStudents.length,
        active_students: mockStudents.filter((s) => s.status === "active").length,
        total_teachers: mockTeachers.length,
        active_teachers: mockTeachers.filter((t) => t.status === "active").length,
        total_classes: mockClasses.length,
        today_classes: mockClasses.filter((c) => c.class_date === today).length,
        total_trial_classes: mockTrialClasses.length,
        pending_trial_classes: mockTrialClasses.filter((tc) => tc.outcome === "pending").length,
      }
    }

    try {
      const today = new Date().toISOString().split("T")[0]

      const [studentsResult, teachersResult, classesResult, todayClassesResult, trialClassesResult] = await Promise.all(
        [
          supabase.from("students").select("*", { count: "exact", head: true }),
          supabase.from("teachers").select("*", { count: "exact", head: true }),
          supabase.from("classes").select("*", { count: "exact", head: true }),
          supabase.from("classes").select("*", { count: "exact", head: true }).eq("class_date", today),
          supabase.from("trial_classes").select("*", { count: "exact", head: true }),
        ],
      )

      return {
        total_students: studentsResult.count || 0,
        active_students: studentsResult.count || 0,
        total_teachers: teachersResult.count || 0,
        active_teachers: teachersResult.count || 0,
        total_classes: classesResult.count || 0,
        today_classes: todayClassesResult.count || 0,
        total_trial_classes: trialClassesResult.count || 0,
        pending_trial_classes: trialClassesResult.count || 0,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats from Supabase:", error)
      return {
        total_students: 0,
        active_students: 0,
        total_teachers: 0,
        active_teachers: 0,
        total_classes: 0,
        today_classes: 0,
        total_trial_classes: 0,
        pending_trial_classes: 0,
      }
    }
  },
}
