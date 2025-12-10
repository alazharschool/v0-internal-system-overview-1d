"use server"

import { studentsAPI, type Student } from "@/lib/database"

export async function createStudent(student: Omit<Student, "id" | "created_at" | "updated_at">) {
  try {
    const result = await studentsAPI.create(student)
    return { success: true, data: result }
  } catch (error) {
    console.error("Create student error:", error)
    return { success: false, error: "Failed to create student" }
  }
}

export async function updateStudent(id: string, updates: Partial<Student>) {
  try {
    const result = await studentsAPI.update(id, updates)
    return { success: true, data: result }
  } catch (error) {
    console.error("Update student error:", error)
    return { success: false, error: "Failed to update student" }
  }
}

export async function deleteStudent(id: string) {
  try {
    const result = await studentsAPI.delete(id)
    return { success: result }
  } catch (error) {
    console.error("Delete student error:", error)
    return { success: false }
  }
}

export async function getStudents() {
  try {
    const students = await studentsAPI.getAll()
    return { success: true, data: students }
  } catch (error) {
    console.error("Get students error:", error)
    return { success: false, error: "Failed to fetch students" }
  }
}

export async function getStudent(id: string) {
  try {
    const student = await studentsAPI.getById(id)
    return { success: true, data: student }
  } catch (error) {
    console.error("Get student error:", error)
    return { success: false, error: "Failed to fetch student" }
  }
}
