"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { generateTimeSlots12Hour } from "@/utils/time-format"

interface AssignClassModalProps {
  studentId: string
  studentName: string
  trigger?: React.ReactNode
}

export function AssignClassModal({ studentId, studentName, trigger }: AssignClassModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    day: "",
    time: "",
    duration: "60",
    type: "regular",
    notes: "",
  })

  const timeSlots = generateTimeSlots12Hour()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const teachers = [
    { id: "sarah", name: "Sarah Johnson", subjects: ["Quran Memorization", "Tajweed"] },
    { id: "michael", name: "Michael Brown", subjects: ["Arabic Language", "Islamic Studies"] },
    { id: "emily", name: "Emily Davis", subjects: ["Quran Memorization", "Arabic Language"] },
    { id: "amanda", name: "Amanda Lee", subjects: ["Tajweed", "Islamic Studies"] },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      toast({
        title: (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Class Assigned Successfully</span>
          </div>
        ),
        description: `${formData.subject} class has been assigned to ${studentName} on ${formData.day} at ${formData.time}.`,
        className: "border-green-200 bg-green-50",
      })
      setFormData({
        subject: "",
        teacher: "",
        day: "",
        time: "",
        duration: "60",
        type: "regular",
        notes: "",
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getAvailableTeachers = () => {
    if (!formData.subject) return teachers
    return teachers.filter((teacher) => teacher.subjects.includes(formData.subject))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Assign Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Class to {studentName}</DialogTitle>
          <DialogDescription>Assign a new class to this student's schedule.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                <SelectItem value="Tajweed">Tajweed</SelectItem>
                <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher *</Label>
            <Select
              value={formData.teacher}
              onValueChange={(value) => handleInputChange("teacher", value)}
              disabled={!formData.subject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableTeachers().map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day *</Label>
              <Select value={formData.day} onValueChange={(value) => handleInputChange("day", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Class Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Class</SelectItem>
                  <SelectItem value="trial">Trial Class</SelectItem>
                  <SelectItem value="makeup">Makeup Class</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special instructions or notes for this class..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Assigning..." : "Assign Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
