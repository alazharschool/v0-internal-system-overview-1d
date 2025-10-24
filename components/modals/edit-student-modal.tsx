"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { studentsAPI, type Student } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  student: Student | null
}

export function EditStudentModal({ isOpen, onClose, onSuccess, student }: EditStudentModalProps) {
  const [loading, setLoading] = useState(false)
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
    status: "active" as const,
  })

  const { toast } = useToast()

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        age: student.age?.toString() || "",
        grade: student.grade || "",
        subject: student.subject || "",
        parent_name: student.parent_name || "",
        parent_phone: student.parent_phone || "",
        address: student.address || "",
        status: student.status as "active" | "inactive" | "graduated",
      })
    }
  }, [student, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!student) return

    setLoading(true)

    try {
      const updateData = {
        ...formData,
        age: formData.age ? Number.parseInt(formData.age) : undefined,
      }

      const result = await studentsAPI.update(student.id, updateData)

      if (result) {
        toast({
          title: "Success",
          description: "Student updated successfully!",
        })
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Error updating student:", error)
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Update the student's information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
                  onChange={(e) => handleInputChange("age", e.target.value)}
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
                  onValueChange={(value) => handleInputChange("grade", value)}
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
                  onValueChange={(value) => handleInputChange("subject", value)}
                  disabled={loading}
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
                    <SelectItem value="Aqeedah">Aqeedah</SelectItem>
                    <SelectItem value="Grammar">Grammar</SelectItem>
                    <SelectItem value="Morphology">Morphology</SelectItem>
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
                  onChange={(e) => handleInputChange("parent_name", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_phone">Parent Phone</Label>
                <Input
                  id="parent_phone"
                  value={formData.parent_phone}
                  onChange={(e) => handleInputChange("parent_phone", e.target.value)}
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
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value as any)}
                disabled={loading}
              >
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
