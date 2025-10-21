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
import { classesAPI, type Class } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

interface EditClassModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  classItem: Class
}

export function EditClassModal({ isOpen, onClose, onSuccess, classItem }: EditClassModalProps) {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    class_date: "",
    start_time: "",
    end_time: "",
    duration: "",
    status: "scheduled" as const,
    notes: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    if (classItem) {
      setFormData({
        subject: classItem.subject || "",
        class_date: classItem.class_date || "",
        start_time: classItem.start_time || "",
        end_time: classItem.end_time || "",
        duration: classItem.duration?.toString() || "",
        status: classItem.status,
        notes: classItem.notes || "",
      })
    }
  }, [classItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        ...formData,
        duration: formData.duration ? Number.parseInt(formData.duration) : classItem.duration,
      }

      const result = await classesAPI.update(classItem.id, updateData)

      if (result) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          onSuccess?.()
          onClose()
        }, 2000)
      } else {
        toast({
          title: "خطأ",
          description: "فشل تحديث الحصة. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating class:", error)
      toast({
        title: "خطأ",
        description: "فشل تحديث الحصة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم التحديث بنجاح!</h2>
            <p className="text-gray-600 text-center">تم تحديث بيانات الحصة بنجاح</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل الحصة</DialogTitle>
          <DialogDescription>تحديث معلومات الحصة الدراسية</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">المادة *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_date">التاريخ *</Label>
              <Input
                id="class_date"
                type="date"
                value={formData.class_date}
                onChange={(e) => setFormData({ ...formData, class_date: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">وقت البداية *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">وقت النهاية *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (دقيقة) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">مجدولة</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                  <SelectItem value="cancelled">ملغاة</SelectItem>
                  <SelectItem value="no_show">لم يحضر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">الملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={loading}
              placeholder="أضف ملاحظات عن الحصة..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "جاري التحديث..." : "تحديث الحصة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
