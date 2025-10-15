"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { studentsAPI, teachersAPI, classesAPI, type Student, type Teacher } from "@/lib/database"
import { generateTimeSlots, addMinutesToTime } from "@/utils/time-format"
import { Loader2, CheckCircle } from "lucide-react"

interface ScheduleClassModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScheduleClassModal({ isOpen, onClose }: ScheduleClassModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "",
    subject: "",
    class_date: "",
    start_time: "",
    duration: "60",
    notes: "",
  })

  const timeSlots = generateTimeSlots(8, 20, 30)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  useEffect(() => {
    // Filter teachers based on selected subject
    if (formData.subject) {
      const filtered = teachers.filter((teacher) => teacher.subjects.includes(formData.subject))
      setFilteredTeachers(filtered)
    } else {
      setFilteredTeachers(teachers)
    }
  }, [formData.subject, teachers])

  const loadData = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([studentsAPI.getAll(), teachersAPI.getAll()])
      setStudents(studentsData)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load students and teachers.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const duration = Number.parseInt(formData.duration)
      const endTime = addMinutesToTime(formData.start_time, duration)

      const classData = {
        student_id: formData.student_id,
        teacher_id: formData.teacher_id,
        subject: formData.subject,
        class_date: formData.class_date,
        start_time: formData.start_time,
        end_time: endTime,
        duration,
        status: "scheduled" as const,
        notes: formData.notes,
      }

      const result = await classesAPI.create(classData)

      if (result) {
        setSuccess(true)
        toast({
          title: "Success",
          description: "Class scheduled successfully!",
        })

        // Reset form after a delay
        setTimeout(() => {
          setFormData({
            student_id: "",
            teacher_id: "",
            subject: "",
            class_date: "",
            start_time: "",
            duration: "60",
            notes: "",
          })
          setSuccess(false)
          onClose()
        }, 1500)
      } else {
        throw new Error("Failed to schedule class")
      }
    } catch (error) {
      console.error("Error scheduling class:", error)
      toast({
        title: "Error",
        description: "Failed to schedule class. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
      subject: student?.subject || "",
    }))
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Scheduled Successfully!</h3>
            <p className="text-gray-600 text-center">The class has been added to the schedule.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Class</DialogTitle>
          <DialogDescription>Schedule a class session for a student with a teacher.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student *</Label>
              <Select value={formData.student_id} onValueChange={handleStudentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher *</Label>
              <Select value={formData.teacher_id} onValueChange={(value) => handleInputChange("teacher_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} - ${teacher.hourly_rate}/hr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_date">Date *</Label>
              <Input
                id="class_date"
                type="date"
                value={formData.class_date}
                onChange={(e) => handleInputChange("class_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Select value={formData.start_time} onValueChange={(value) => handleInputChange("start_time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Class Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional notes for this class session..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Schedule Class
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
