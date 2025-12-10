"use server"

import { teachersAPI, type Teacher } from "@/lib/database"

export async function createTeacher(teacher: Omit<Teacher, "id" | "created_at" | "updated_at">) {
  try {
    const result = await teachersAPI.create(teacher)
    return { success: true, data: result }
  } catch (error) {
    console.error("Create teacher error:", error)
    return { success: false, error: "Failed to create teacher" }
  }
}

export async function updateTeacher(id: string, updates: Partial<Teacher>) {
  try {
    const result = await teachersAPI.update(id, updates)
    return { success: true, data: result }
  } catch (error) {
    console.error("Update teacher error:", error)
    return { success: false, error: "Failed to update teacher" }
  }
}

export async function deleteTeacher(id: string) {
  try {
    const result = await teachersAPI.delete(id)
    return { success: result }
  } catch (error) {
    console.error("Delete teacher error:", error)
    return { success: false }
  }
}

export async function getTeachers() {
  try {
    const teachers = await teachersAPI.getAll()
    return { success: true, data: teachers }
  } catch (error) {
    console.error("Get teachers error:", error)
    return { success: false, error: "Failed to fetch teachers" }
  }
}

export async function getTeacher(id: string) {
  try {
    const teacher = await teachersAPI.getById(id)
    return { success: true, data: teacher }
  } catch (error) {
    console.error("Get teacher error:", error)
    return { success: false, error: "Failed to fetch teacher" }
  }
}
