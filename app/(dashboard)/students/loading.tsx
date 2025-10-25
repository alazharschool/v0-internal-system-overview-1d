export default function Loading() {
  return null
}
// ===========================
// STUDENTS PAGE BUTTONS HANDLERS
// ===========================
import { studentsAPI, classesAPI, trialClassesAPI } from "@/lib/database"
import { toast } from "sonner"
import { useState } from "react"

export const useStudentsPage = () => {
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    try {
      setLoading(true)
      await Promise.all([studentsAPI.getAll(), classesAPI.getAll(), trialClassesAPI.getAll()])
      toast.success("Page refreshed!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to refresh page")
    } finally {
      setLoading(false)
    }
  }

  const addStudent = async (student: any) => {
    try {
      await studentsAPI.create(student)
      toast.success("Student added!")
      refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to add student")
    }
  }

  const editStudent = async (id: string, updates: any) => {
    try {
      await studentsAPI.update(id, updates)
      toast.success("Student updated!")
      refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update student")
    }
  }

  const scheduleClass = async (classData: any) => {
    try {
      await classesAPI.create(classData)
      toast.success("Class scheduled!")
      refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to schedule class")
    }
  }

  const issueCertificate = async (studentId: string) => {
    try {
      console.log("Certificate issued for", studentId)
      toast.success("Certificate issued!")
      refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to issue certificate")
    }
  }

  return { loading, refresh, addStudent, editStudent, scheduleClass, issueCertificate }
}
