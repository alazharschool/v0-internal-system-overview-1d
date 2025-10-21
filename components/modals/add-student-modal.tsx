"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { studentsAPI } from "@/lib/database"
import { sanitizeStudentData } from "@/utils/sanitize"
import { Plus } from "lucide-react"

interface AddStudentModalProps {
  onStudentAdded?: () => void
}

export function AddStudentModal({ onStudentAdded }: AddStudentModalProps) {
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
      age: "",
      grade: "",
      subject: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      address: "",
      status: "active",
      enrollment_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  const onSubmit = async (formData: any) => {
    setLoading(true)
    try {
      const sanitizedData = sanitizeStudentData(formData)
      const result = await studentsAPI.create(sanitizedData)

      if (result) {
        toast({
          title: "✅ تم بنجاح!",
          description: `تم إضافة الطالب ${formData.name} بنجاح`,
          duration: 3000,
        })
        reset()
        setOpen(false)
        onStudentAdded?.()
      } else {
        toast({
          title: "❌ حدث خطأ",
          description: "فشل إضافة الطالب",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء إضافة الطالب",
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
          إضافة طالب جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة طالب جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم */}
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <Input id="name" placeholder="اسم الطالب" {...register("name", { required: "الاسم مطلوب" })} />
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

            {/* العمر */}
            <div className="space-y-2">
              <Label htmlFor="age">العمر</Label>
              <Input id="age" type="number" placeholder="العمر" {...register("age")} />
            </div>

            {/* الصف */}
            <div className="space-y-2">
              <Label htmlFor="grade">الصف *</Label>
              <Input id="grade" placeholder="الصف" {...register("grade", { required: "الصف مطلوب" })} />
              {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
            </div>

            {/* المادة */}
            <div className="space-y-2">
              <Label htmlFor="subject">المادة *</Label>
              <Input id="subject" placeholder="المادة" {...register("subject", { required: "المادة مطلوبة" })} />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            {/* اسم ولي الأمر */}
            <div className="space-y-2">
              <Label htmlFor="parent_name">اسم ولي الأمر</Label>
              <Input id="parent_name" placeholder="اسم ولي الأمر" {...register("parent_name")} />
            </div>

            {/* هاتف ولي الأمر */}
            <div className="space-y-2">
              <Label htmlFor="parent_phone">هاتف ولي الأمر</Label>
              <Input id="parent_phone" placeholder="هاتف ولي الأمر" {...register("parent_phone")} />
            </div>

            {/* بريد ولي الأمر */}
            <div className="space-y-2">
              <Label htmlFor="parent_email">بريد ولي الأمر</Label>
              <Input id="parent_email" type="email" placeholder="بريد ولي الأمر" {...register("parent_email")} />
            </div>

            {/* العنوان */}
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" placeholder="العنوان" {...register("address")} />
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
                  <SelectItem value="graduated">تخرج</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* تاريخ الالتحاق */}
            <div className="space-y-2">
              <Label htmlFor="enrollment_date">تاريخ الالتحاق</Label>
              <Input
                id="enrollment_date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                {...register("enrollment_date")}
              />
            </div>
          </div>

          {/* ملاحظات */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <textarea
              id="notes"
              placeholder="ملاحظات إضافية"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              {...register("notes")}
            />
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري الإضافة..." : "إضافة الطالب"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
