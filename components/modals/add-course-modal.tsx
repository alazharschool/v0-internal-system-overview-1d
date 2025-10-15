"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { coursesAPI, studentsAPI, teachersAPI, type Student, type Teacher } from "@/lib/database"
import { toast } from "@/hooks/use-toast"
import { CalendarDays, BookOpen, Users, GraduationCap } from "lucide-react"

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const subjects = [
  "Quran Memorization",
  "Tajweed",
  "Arabic Language",
  "Islamic Studies",
  "Hadith Studies",
  "Tafseer",
  "Fiqh",
  "Aqeedah",
]

export function AddCourseModal({ isOpen, onClose, onSuccess }: AddCourseModalProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "",
    subject: "",
    total_classes: "",
    start_date: "",
    end_date: "",
    monthly_fee: "",
    notes: "",
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
      resetForm()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([studentsAPI.getAll(), teachersAPI.getAll()])
      setStudents(studentsData.filter((s) => s.status === "active"))
      setTeachers(teachersData.filter((t) => t.status === "active"))
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load students and teachers",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      student_id: "",
      teacher_id: "",
      subject: "",
      total_classes: "",
      start_date: "",
      end_date: "",
      monthly_fee: "",
      notes: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.student_id ||
      !formData.teacher_id ||
      !formData.subject ||
      !formData.total_classes ||
      !formData.start_date ||
      !formData.monthly_fee
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Calculate end date if not provided (assume 1 month duration)
      let endDate = formData.end_date
      if (!endDate) {
        const startDate = new Date(formData.start_date)
        startDate.setMonth(startDate.getMonth() + 1)
        endDate = startDate.toISOString().split("T")[0]
      }

      const courseData = {
        student_id: formData.student_id,
        teacher_id: formData.teacher_id,
        subject: formData.subject,
        total_classes: Number.parseInt(formData.total_classes),
        completed_classes: 0,
        remaining_classes: Number.parseInt(formData.total_classes),
        start_date: formData.start_date,
        end_date: endDate,
        status: "active" as const,
        progress_percentage: 0,
        monthly_fee: Number.parseFloat(formData.monthly_fee),
        notes: formData.notes,
      }

      await coursesAPI.create(courseData)

      toast({
        title: "Success",
        description: "Course created successfully!",
      })

      onSuccess()
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getFilteredTeachers = () => {
    if (!formData.subject) return teachers
    return teachers.filter(
      (teacher) => teacher.subjects.includes(formData.subject) || teacher.subject === formData.subject,
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Add New Course
          </DialogTitle>
          <DialogDescription>Create a new course enrollment for a student with a teacher.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Selection */}
            <div className="space-y-2">
              <Label htmlFor="student_id" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Student *
              </Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-sm text-gray-500">{student.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                Subject *
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value, teacher_id: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label htmlFor="teacher_id" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-600" />
              Teacher *
            </Label>
            <Select
              value={formData.teacher_id}
              onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
              disabled={!formData.subject}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.subject ? "Select a teacher" : "Select subject first"} />
              </SelectTrigger>
              <SelectContent>
                {getFilteredTeachers().map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{teacher.name}</span>
                      <span className="text-sm text-gray-500">
                        ${teacher.hourly_rate}/hr • {teacher.subjects.join(", ")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Classes */}
            <div className="space-y-2">
              <Label htmlFor="total_classes">Total Classes *</Label>
              <Input
                id="total_classes"
                type="number"
                min="1"
                max="50"
                placeholder="e.g., 20"
                value={formData.total_classes}
                onChange={(e) => setFormData({ ...formData, total_classes: e.target.value })}
              />
            </div>

            {/* Monthly Fee */}
            <div className="space-y-2">
              <Label htmlFor="monthly_fee">Monthly Fee ($) *</Label>
              <Input
                id="monthly_fee"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 300"
                value={formData.monthly_fee}
                onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-600" />
                Start Date *
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
          </div>

          {/* End Date (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="end_date" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-600" />
              End Date (Optional)
            </Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
            <p className="text-sm text-gray-500">If not specified, end date will be set to 1 month from start date</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this course..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
