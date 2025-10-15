"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AddStudentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

interface WeeklySchedule {
  id: string
  dayOfWeek: string
  time: string
  duration: number
  subject: string
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function AddStudentModal({ open, onOpenChange, onSubmit }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    grade: "",
    subject: "",
    status: "active",
    enrollment_date: new Date().toISOString().split("T")[0],
    address: "",
    notes: "",
  })

  const [parentData, setParentData] = useState({
    parent_name: "",
    parent_phone: "",
    parent_email: "",
  })

  const [showParentInfo, setShowParentInfo] = useState(false)
  const [enableAutoSchedule, setEnableAutoSchedule] = useState(false)
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleParentInputChange = (field: string, value: string) => {
    setParentData((prev) => ({ ...prev, [field]: value }))
  }

  const addWeeklySchedule = () => {
    const newSchedule: WeeklySchedule = {
      id: Math.random().toString(36).substr(2, 9),
      dayOfWeek: "Sunday",
      time: "10:00",
      duration: 60,
      subject: formData.subject || "",
    }
    setWeeklySchedules([...weeklySchedules, newSchedule])
  }

  const removeWeeklySchedule = (id: string) => {
    setWeeklySchedules(weeklySchedules.filter((s) => s.id !== id))
  }

  const updateWeeklySchedule = (id: string, field: string, value: any) => {
    setWeeklySchedules(weeklySchedules.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const studentData = {
      ...formData,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      ...(showParentInfo && parentData),
      weeklySchedules: enableAutoSchedule ? weeklySchedules : undefined,
    }

    onSubmit(studentData)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      grade: "",
      subject: "",
      status: "active",
      enrollment_date: new Date().toISOString().split("T")[0],
      address: "",
      notes: "",
    })
    setParentData({
      parent_name: "",
      parent_phone: "",
      parent_email: "",
    })
    setShowParentInfo(false)
    setEnableAutoSchedule(false)
    setWeeklySchedules([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter student information and optionally create a monthly schedule</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="student@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+966-555-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                      <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                      <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                      <SelectItem value="Tajweed">Tajweed</SelectItem>
                      <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Level</Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                    placeholder="Enter grade or level"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollment_date">Enrollment Date</Label>
                  <Input
                    id="enrollment_date"
                    type="date"
                    value={formData.enrollment_date}
                    onChange={(e) => handleInputChange("enrollment_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter student address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes about the student..."
                  rows={3}
                />
              </div>
            </div>

            {/* Parent Information (Optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="show-parent" checked={showParentInfo} onCheckedChange={setShowParentInfo} />
                  <Label htmlFor="show-parent" className="text-lg font-semibold cursor-pointer">
                    Parent Information (Optional)
                  </Label>
                </div>
                {showParentInfo ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>

              {showParentInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">Parent Name</Label>
                    <Input
                      id="parent_name"
                      value={parentData.parent_name}
                      onChange={(e) => handleParentInputChange("parent_name", e.target.value)}
                      placeholder="Enter parent name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent_phone">Parent Phone</Label>
                    <Input
                      id="parent_phone"
                      value={parentData.parent_phone}
                      onChange={(e) => handleParentInputChange("parent_phone", e.target.value)}
                      placeholder="+966-555-0000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="parent_email">Parent Email</Label>
                    <Input
                      id="parent_email"
                      type="email"
                      value={parentData.parent_email}
                      onChange={(e) => handleParentInputChange("parent_email", e.target.value)}
                      placeholder="parent@email.com"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Auto Schedule Feature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-schedule" checked={enableAutoSchedule} onCheckedChange={setEnableAutoSchedule} />
                  <Label htmlFor="auto-schedule" className="text-lg font-semibold cursor-pointer">
                    Generate Monthly Schedule Automatically
                  </Label>
                </div>
              </div>

              {enableAutoSchedule && (
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Class Schedule</CardTitle>
                    <CardDescription>
                      Define recurring weekly classes to automatically generate monthly schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weeklySchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-end gap-2 p-4 border rounded-lg bg-gray-50">
                        <div className="flex-1 space-y-2">
                          <Label>Day of Week</Label>
                          <Select
                            value={schedule.dayOfWeek}
                            onValueChange={(value) => updateWeeklySchedule(schedule.id, "dayOfWeek", value)}
                          >
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

                        <div className="flex-1 space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={schedule.time}
                            onChange={(e) => updateWeeklySchedule(schedule.id, "time", e.target.value)}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <Label>Duration (min)</Label>
                          <Input
                            type="number"
                            value={schedule.duration}
                            onChange={(e) =>
                              updateWeeklySchedule(schedule.id, "duration", Number.parseInt(e.target.value))
                            }
                            placeholder="60"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <Label>Subject</Label>
                          <Input
                            value={schedule.subject}
                            onChange={(e) => updateWeeklySchedule(schedule.id, "subject", e.target.value)}
                            placeholder="Subject"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeWeeklySchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={addWeeklySchedule}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Weekly Class Time
                    </Button>

                    {weeklySchedules.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> The system will automatically create classes for the next month based
                          on these weekly schedules.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
