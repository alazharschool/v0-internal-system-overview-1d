"use client"

import type React from "react"
import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AddStudentModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onStudentAdded?: () => void
}

interface WeeklyClass {
  day: string
  start_time: string
  end_time: string
  subject: string
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const SUBJECTS = [
  "Quran Memorization",
  "Arabic Language",
  "Islamic Studies",
  "Hadith Studies",
  "Fiqh",
  "Tafsir",
  "Tajweed",
  "Aqeedah",
  "Grammar",
  "Morphology",
]

export function AddStudentModal({ open = false, onOpenChange, onStudentAdded }: AddStudentModalProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"personal" | "schedule">("personal")
  const [weeklyClasses, setWeeklyClasses] = useState<WeeklyClass[]>([])
  const [newClass, setNewClass] = useState<WeeklyClass>({
    day: "Monday",
    start_time: "08:00",
    end_time: "09:00",
    subject: "Quran Memorization",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    grade: "",
    subject: "",
    parent_name: "",
    parent_phone: "",
    address: "",
    status: "active",
  })

  const { toast } = useToast()

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const addWeeklyClass = () => {
    if (!newClass.day || !newClass.start_time || !newClass.end_time || !newClass.subject) {
      toast({
        title: "Validation Error",
        description: "Please fill in all schedule fields",
        variant: "destructive",
      })
      return
    }

    // Check if class already exists for this day
    const exists = weeklyClasses.some((c) => c.day === newClass.day && c.start_time === newClass.start_time)

    if (exists) {
      toast({
        title: "Duplicate",
        description: "This class time already exists for this day",
        variant: "destructive",
      })
      return
    }

    setWeeklyClasses([...weeklyClasses, { ...newClass }])
    setNewClass({
      day: "Monday",
      start_time: "08:00",
      end_time: "09:00",
      subject: "Quran Memorization",
    })

    toast({
      title: "Success",
      description: "Class added to schedule",
    })
  }

  const removeWeeklyClass = (index: number) => {
    setWeeklyClasses(weeklyClasses.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, Phone)",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const studentData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        age: formData.age ? Number.parseInt(formData.age) : undefined,
        grade: formData.grade || undefined,
        subject: formData.subject || undefined,
        parent_name: formData.parent_name || undefined,
        parent_phone: formData.parent_phone || undefined,
        address: formData.address || undefined,
        status: formData.status,
        enrollment_date: new Date().toISOString().split("T")[0],
        weekly_schedule: weeklyClasses,
      }

      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })

      if (!response.ok) {
        throw new Error("Failed to add student")
      }

      toast({
        title: "Success",
        description: "Student added successfully with schedule!",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        grade: "",
        subject: "",
        parent_name: "",
        parent_phone: "",
        address: "",
        status: "active",
      })
      setWeeklyClasses([])
      setActiveTab("personal")

      onStudentAdded?.()
      handleOpenChange(false)
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Fill in the student information and set their class schedule</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "personal"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === "schedule"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Weekly Schedule
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PERSONAL INFO TAB */}
          {activeTab === "personal" && (
            <>
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+20-100-123-4567"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="15"
                      min="5"
                      max="120"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Academic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData({ ...formData, grade: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 1">Grade 1</SelectItem>
                        <SelectItem value="Grade 2">Grade 2</SelectItem>
                        <SelectItem value="Grade 3">Grade 3</SelectItem>
                        <SelectItem value="Grade 4">Grade 4</SelectItem>
                        <SelectItem value="Grade 5">Grade 5</SelectItem>
                        <SelectItem value="Grade 6">Grade 6</SelectItem>
                        <SelectItem value="Grade 7">Grade 7</SelectItem>
                        <SelectItem value="Grade 8">Grade 8</SelectItem>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="University">University</SelectItem>
                        <SelectItem value="Adult">Adult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Parent Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Parent Name</Label>
                    <Input
                      id="parent_name"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      placeholder="Parent's name"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent_phone">Parent Phone</Label>
                    <Input
                      id="parent_phone"
                      value={formData.parent_phone}
                      onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                      placeholder="Parent's phone number"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Address and Status */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Additional Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter student's address..."
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Add Weekly Class Schedule</h3>
                <p className="text-sm text-gray-600 mb-4">Set up recurring class times for each day of the week</p>
              </div>

              {/* Add New Class Form */}
              <Card className="p-4 bg-slate-50">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select value={newClass.day} onValueChange={(value) => setNewClass({ ...newClass, day: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={newClass.subject}
                        onValueChange={(value) => setNewClass({ ...newClass, subject: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={newClass.start_time}
                        onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={newClass.end_time}
                        onChange={(e) => setNewClass({ ...newClass, end_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addWeeklyClass} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Schedule
                  </Button>
                </div>
              </Card>

              {/* Schedule List */}
              {weeklyClasses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800">Weekly Schedule:</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {weeklyClasses.map((cls, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {cls.day} - {cls.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cls.start_time} to {cls.end_time}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWeeklyClass(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weeklyClasses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No classes added yet. Add classes to create a weekly schedule.</p>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
