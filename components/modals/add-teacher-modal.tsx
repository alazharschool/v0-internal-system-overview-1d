"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { teachersAPI } from "@/lib/database"
import { Plus } from "lucide-react"

interface AddTeacherModalProps {
  onTeacherAdded?: () => void
}

export function AddTeacherModal({ onTeacherAdded }: AddTeacherModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      hourly_rate: "",
      status: "active",
      bio: "",
      zoom_link: "",
    },
  })

  const onSubmit = async (formData: any) => {
    setLoading(true)
    try {
      const result = await teachersAPI.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        subjects: [formData.subject],
        hourly_rate: Number.parseFloat(formData.hourly_rate) || 100,
        join_date: new Date().toISOString().split("T")[0],
        status: formData.status,
        bio: formData.bio,
        zoom_link: formData.zoom_link,
      })

      if (result) {
        toast({
          title: "✅ تم بنجاح!",
          description: `تم إضافة المعلم ${formData.name} بنجاح`,
          duration: 3000,
        })
        reset()
        setOpen(false)
        onTeacherAdded?.()
      } else {
        toast({
          title: "❌ حدث خطأ",
          description: "فشل إضافة المعلم",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء إضافة المعلم",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة معلم جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة معلم جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم */}
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input id="name" placeholder="اسم المعلم" {...register("name", { required: "الاسم مطلوب" })} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                placeholder="البريد الإلكتروني"
                {...register("email", { required: "البريد الإلكتروني مطلوب" })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* الهاتف */}
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input id="phone" placeholder="رقم الهاتف" {...register("phone", { required: "رقم الهاتف مطلوب" })} />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            {/* المادة */}
            <div className="space-y-2">
              <Label htmlFor="subject">المادة *</Label>
              <Input id="subject" placeholder="المادة" {...register("subject", { required: "المادة مطلوبة" })} />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            {/* سعر الساعة */}
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">سعر الساعة *</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="سعر الساعة"
                {...register("hourly_rate", { required: "سعر الساعة مطلوب" })}
              />
              {errors.hourly_rate && <p className="text-sm text-red-500">{errors.hourly_rate.message}</p>}
            </div>

            {/* الحالة */}
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* رابط Zoom */}
          <div className="space-y-2">
            <Label htmlFor="zoom_link">رابط Zoom</Label>
            <Input id="zoom_link" type="url" placeholder="https://zoom.us/j/..." {...register("zoom_link")} />
          </div>

          {/* السيرة الذاتية */}
          <div className="space-y-2">
            <Label htmlFor="bio">السيرة الذاتية</Label>
            <textarea
              id="bio"
              placeholder="السيرة الذاتية والمؤهلات"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              {...register("bio")}
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الإضافة..." : "إضافة المعلم"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
