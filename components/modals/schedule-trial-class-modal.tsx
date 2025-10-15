"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calendar, User, BookOpen } from "lucide-react"
import { trialClassesAPI, teachersAPI, type Teacher } from "@/lib/database"

export function ScheduleTrialClassModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentAge: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    subject: "",
    teacher: "",
    date: "",
    time: "",
    duration: "30",
    notes: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      const data = await teachersAPI.getAll()
      setTeachers(data.filter((t) => t.status === "active"))
    } catch (error) {
      console.error("Error loading teachers:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await trialClassesAPI.create({
        student_name: formData.studentName,
        student_email: formData.studentEmail,
        student_phone: formData.studentPhone,
        parent_name: formData.guardianName || undefined,
        parent_phone: formData.guardianPhone || undefined,
        teacher_id: formData.teacher,
        subject: formData.subject,
        date: formData.date,
        time: formData.time,
        duration: Number.parseInt(formData.duration),
        status: "scheduled",
        outcome: "pending",
        notes: formData.notes || undefined,
      })

      toast({
        title: "Success",
        description: "Trial class scheduled successfully!",
      })

      setOpen(false)
      setFormData({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        studentAge: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: "",
        subject: "",
        teacher: "",
        date: "",
        time: "",
        duration: "30",
        notes: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error scheduling trial class:", error)
      toast({
        title: "Error",
        description: "Failed to schedule trial class. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Trial Class
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Trial Class</DialogTitle>
          <DialogDescription>Schedule a new trial class for a prospective student.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Student Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange("studentName", e.target.value)}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentAge">Age</Label>
                <Input
                  id="studentAge"
                  type="number"
                  value={formData.studentAge}
                  onChange={(e) => handleInputChange("studentAge", e.target.value)}
                  placeholder="Student's age"
                  min="1"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentEmail">Student Email</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                  placeholder="student@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPhone">Student Phone *</Label>
                <Input
                  id="studentPhone"
                  value={formData.studentPhone}
                  onChange={(e) => handleInputChange("studentPhone", e.target.value)}
                  placeholder="+966-555-0123"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Guardian Information (Optional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange("guardianName", e.target.value)}
                  placeholder="Enter guardian's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                  placeholder="+966-555-0124"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                  placeholder="guardian@example.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-800">Class Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => handleInputChange("subject", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                    <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                    <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                    <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                    <SelectItem value="Fiqh">Fiqh</SelectItem>
                    <SelectItem value="Tafsir">Tafsir</SelectItem>
                    <SelectItem value="Tajweed">Tajweed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher *</Label>
                <Select
                  value={formData.teacher}
                  onValueChange={(value) => handleInputChange("teacher", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-800">Schedule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  required
                />
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Additional Notes</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes about the trial class..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.studentName ||
                !formData.studentPhone ||
                !formData.subject ||
                !formData.teacher ||
                !formData.date ||
                !formData.time
              }
            >
              {loading ? "Scheduling..." : "Schedule Trial Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
