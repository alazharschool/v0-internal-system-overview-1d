"use server"

import { classesAPI, trialClassesAPI, type Class, type TrialClass } from "@/lib/database"

export async function createClass(classData: Omit<Class, "id" | "created_at" | "updated_at">) {
  try {
    const result = await classesAPI.create(classData)
    return { success: true, data: result }
  } catch (error) {
    console.error("Create class error:", error)
    return { success: false, error: "Failed to create class" }
  }
}

export async function updateClass(id: string, updates: Partial<Class>) {
  try {
    const result = await classesAPI.update(id, updates)
    return { success: true, data: result }
  } catch (error) {
    console.error("Update class error:", error)
    return { success: false, error: "Failed to update class" }
  }
}

export async function deleteClass(id: string) {
  try {
    const result = await classesAPI.delete(id)
    return { success: result }
  } catch (error) {
    console.error("Delete class error:", error)
    return { success: false }
  }
}

export async function getClasses() {
  try {
    const classes = await classesAPI.getAll()
    return { success: true, data: classes }
  } catch (error) {
    console.error("Get classes error:", error)
    return { success: false, error: "Failed to fetch classes" }
  }
}

export async function getClass(id: string) {
  try {
    const classItem = await classesAPI.getById(id)
    return { success: true, data: classItem }
  } catch (error) {
    console.error("Get class error:", error)
    return { success: false, error: "Failed to fetch class" }
  }
}

export async function createTrialClass(trialClass: Omit<TrialClass, "id" | "created_at" | "updated_at">) {
  try {
    const result = await trialClassesAPI.create(trialClass)
    return { success: true, data: result }
  } catch (error) {
    console.error("Create trial class error:", error)
    return { success: false, error: "Failed to create trial class" }
  }
}

export async function getTrialClasses() {
  try {
    const trialClasses = await trialClassesAPI.getAll()
    return { success: true, data: trialClasses }
  } catch (error) {
    console.error("Get trial classes error:", error)
    return { success: false, error: "Failed to fetch trial classes" }
  }
}
