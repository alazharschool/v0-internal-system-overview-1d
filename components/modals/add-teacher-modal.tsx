"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { teachersAPI } from "@/lib/database"
import { Plus, X, LinkIcon } from "lucide-react"

interface AddTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddTeacherModal({ isOpen, onClose, onSuccess }: AddTeacherModalProps) {
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<string[]>([""])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    hourly_rate: "",
    bio: "",
    zoom_link: "",
    status: "active" as const,
  })
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSubject = () => {
    setSubjects((prev) => [...prev, ""])
  }

  const updateSubject = (index: number, value: string) => {
    setSubjects((prev) => prev.map((subject, i) => (i === index ? value : subject)))
  }

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const filteredSubjects = subjects.filter((s) => s.trim() !== "")
      const teacherData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || filteredSubjects[0] || "",
        subjects: filteredSubjects.length > 0 ? filteredSubjects : [formData.subject],
        hourly_rate: Number.parseFloat(formData.hourly_rate) || 0,
        join_date: new Date().toISOString().split("T")[0],
        status: formData.status,
        bio: formData.bio,
        zoom_link: formData.zoom_link,
      }

      await teachersAPI.create(teacherData)

      toast({
        title: "Success",
        description: "Teacher added successfully!",
      })

      onSuccess()
      onClose()

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        hourly_rate: "",
        bio: "",
        zoom_link: "",
        status: "active",
      })
      setSubjects([""])
    } catch (error) {
      console.error("Error adding teacher:", error)
      toast({
        title: "Error",
        description: "Failed to add teacher. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>Enter the teacher's information to add them to the system.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter teacher's full name"
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
                  placeholder="teacher@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+20-100-123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange("hourly_rate", e.target.value)}
                  placeholder="150.00"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Zoom Link */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Zoom Meeting Link
            </h3>
            <div className="space-y-2">
              <Label htmlFor="zoom_link">Zoom Link (Optional)</Label>
              <Input
                id="zoom_link"
                type="url"
                value={formData.zoom_link}
                onChange={(e) => handleInputChange("zoom_link", e.target.value)}
                placeholder="https://zoom.us/j/1234567890"
              />
              <p className="text-xs text-slate-500">Personal Zoom meeting room link for online classes</p>
            </div>
          </div>

          {/* Primary Subject */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Primary Subject</h3>
            <div className="space-y-2">
              <Label htmlFor="subject">Primary Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                  <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                  <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                  <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                  <SelectItem value="Fiqh">Fiqh</SelectItem>
                  <SelectItem value="Tafsir">Tafsir</SelectItem>
                  <SelectItem value="Tajweed">Tajweed</SelectItem>
                  <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                  <SelectItem value="Grammar">Grammar</SelectItem>
                  <SelectItem value="Morphology">Morphology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Subjects */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">Additional Subjects (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select value={subject} onValueChange={(value) => updateSubject(index, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select additional subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                        <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                        <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                        <SelectItem value="Fiqh">Fiqh</SelectItem>
                        <SelectItem value="Tafsir">Tafsir</SelectItem>
                        <SelectItem value="Tajweed">Tajweed</SelectItem>
                        <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                        <SelectItem value="Grammar">Grammar</SelectItem>
                        <SelectItem value="Morphology">Morphology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {subjects.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubject(index)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSubject}
                className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Subject
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Status</h3>
            <div className="space-y-2">
              <Label htmlFor="status">Teacher Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value as any)}>
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

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Brief description of the teacher's background, qualifications, and teaching experience..."
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.subject || !formData.phone}
            >
              {loading ? "Adding..." : "Add Teacher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
