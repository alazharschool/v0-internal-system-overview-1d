import { supabase, type Teacher, handleSupabaseError } from "../supabase"

export async function getTeachers(): Promise<Teacher[]> {
  try {
    const { data, error } = await supabase.from("teachers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching teachers:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch teachers:", error)
    return []
  }
}

export async function getTeacher(id: string): Promise<Teacher | null> {
  try {
    const { data, error } = await supabase.from("teachers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching teacher:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch teacher:", error)
    return null
  }
}

export async function addTeacher(teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) {
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

    if (error) {
      console.error("Error adding teacher:", error)
      return handleSupabaseError(error)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to add teacher:", error)
    return handleSupabaseError(error)
  }
}

export async function updateTeacher(id: string, updates: Partial<Teacher>) {
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

    if (error) {
      console.error("Error updating teacher:", error)
      return handleSupabaseError(error)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Failed to update teacher:", error)
    return handleSupabaseError(error)
  }
}

export async function deleteTeacher(id: string) {
  try {
    const { error } = await supabase.from("teachers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting teacher:", error)
      return handleSupabaseError(error)
    }

    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete teacher:", error)
    return handleSupabaseError(error)
  }
}

export async function getTeacherStats(teacherId: string) {
  try {
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacherId)

    if (classesError) {
      console.error("Error fetching teacher classes:", classesError)
      return null
    }

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", teacherId)

    if (coursesError) {
      console.error("Error fetching teacher courses:", coursesError)
      return null
    }

    const totalClasses = classes?.length || 0
    const completedClasses = classes?.filter((c) => c.status === "completed").length || 0
    const upcomingClasses = classes?.filter((c) => c.status === "scheduled").length || 0
    const activeCourses = courses?.filter((c) => c.status === "active").length || 0

    return {
      totalClasses,
      completedClasses,
      upcomingClasses,
      activeCourses,
    }
  } catch (error) {
    console.error("Failed to fetch teacher stats:", error)
    return null
  }
}

export async function getTeacherClasses(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select(
        `
        *,
        students (
          id,
          name,
          email
        )
      `,
      )
      .eq("teacher_id", teacherId)
      .order("class_date", { ascending: false })

    if (error) {
      console.error("Error fetching teacher classes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch teacher classes:", error)
    return []
  }
}

export async function getTeachersBySubject(subject: string): Promise<Teacher[]> {
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("subject", subject)
      .eq("status", "active")
      .order("name")

    if (error) {
      console.error("Error fetching teachers by subject:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch teachers by subject:", error)
    return []
  }
}
