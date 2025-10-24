"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { studentsAPI, type Student } from "@/lib/database"
import { AddStudentModal } from "@/components/modals/add-student-modal"
import { ScheduleClassModal } from "@/components/modals/schedule-class-modal"
import { Search, Plus, Calendar, Trash2 } from "lucide-react"

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      const data = await studentsAPI.getAll()
      setStudents(data)
    } catch (error) {
      console.error("Error loading students:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load students",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleClass = (student: Student) => {
    setSelectedStudent(student)
    setScheduleModalOpen(true)
  }

  const handleDeleteStudent = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الطالب ${name}؟`)) {
      try {
        const success = await studentsAPI.delete(id)
        if (success) {
          toast({
            title: "✅ تم الحذف",
            description: "تم حذف الطالب بنجاح",
          })
          loadStudents()
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "❌ خطأ",
          description: "فشل حذف الطالب",
        })
      }
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الطلاب...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الطلاب</h1>
          <p className="text-gray-600 mt-1">إدارة جميع الطلاب والحصص</p>
        </div>
        <AddStudentModal onStudentAdded={loadStudents} />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="ابحث عن طالب بالاسم أو البريد الإلكتروني..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب</CardTitle>
          <CardDescription>إجمالي الطلاب: {filteredStudents.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الصف</TableHead>
                  <TableHead>المادة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder_svg_128px.png`} />
                            <AvatarFallback className="bg-yellow-100 text-yellow-700">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => router.push(`/students/${student.id}`)}
                          >
                            <p className="font-medium">{student.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.subject}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : student.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {student.status === "active" ? "نشط" : student.status === "inactive" ? "غير نشط" : "تخرج"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleScheduleClass(student)}
                            title="إضافة حصة جديدة"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/students/${student.id}`)}
                            title="عرض التفاصيل"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            className="text-red-600 hover:text-red-700"
                            title="حذف الطالب"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Class Modal */}
      <ScheduleClassModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false)
          setSelectedStudent(null)
          loadStudents()
        }}
      />
    </div>
  )
}
