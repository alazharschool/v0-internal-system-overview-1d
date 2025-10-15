"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  UserX,
} from "lucide-react"
import { studentsAPI, classesAPI, type Student, type Class } from "@/lib/database"
import { formatEgyptTime, formatStudentTime, getDayName } from "@/utils/time-format"
import { useToast } from "@/hooks/use-toast"

interface MonthlyStats {
  total_classes: number
  completed: number
  student_cancelled: number
  teacher_cancelled: number
  total_hours: number
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<Student | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    total_classes: 0,
    completed: 0,
    student_cancelled: 0,
    teacher_cancelled: 0,
    total_hours: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadStudentData()
  }, [params.id, selectedMonth])

  const loadStudentData = async () => {
    try {
      setLoading(true)
      const studentId = params.id as string
      const [studentData, allClasses] = await Promise.all([studentsAPI.getById(studentId), classesAPI.getAll()])

      if (!studentData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Student not found",
        })
        router.push("/students")
        return
      }

      setStudent(studentData)

      // Filter classes for this student and selected month
      const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
      const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)

      const studentClasses = allClasses
        .filter((cls) => {
          const classDate = new Date(cls.class_date)
          return cls.student_id === studentId && classDate >= monthStart && classDate <= monthEnd
        })
        .sort((a, b) => {
          const dateCompare = new Date(a.class_date).getTime() - new Date(b.class_date).getTime()
          if (dateCompare !== 0) return dateCompare
          const timeA = a.start_time.split(":").map(Number)
          const timeB = b.start_time.split(":").map(Number)
          return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
        })

      setClasses(studentClasses)

      // Initialize editing notes
      const notes: { [key: string]: string } = {}
      studentClasses.forEach((cls) => {
        notes[cls.id] = cls.notes || ""
      })
      setEditingNotes(notes)

      // Calculate monthly statistics
      const stats: MonthlyStats = {
        total_classes: studentClasses.length,
        completed: studentClasses.filter((c) => c.status === "completed").length,
        student_cancelled: studentClasses.filter(
          (c) => c.status === "cancelled" && c.notes?.toLowerCase().includes("student"),
        ).length,
        teacher_cancelled: studentClasses.filter(
          (c) => c.status === "cancelled" && c.notes?.toLowerCase().includes("teacher"),
        ).length,
        total_hours:
          studentClasses.filter((c) => c.status === "completed").reduce((sum, c) => sum + c.duration, 0) / 60,
      }
      setMonthlyStats(stats)
    } catch (error) {
      console.error("Error loading student data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load student data",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (classId: string, newStatus: string) => {
    try {
      await classesAPI.update(classId, { status: newStatus as any })
      await loadStudentData()
      toast({
        title: "Success",
        description: "Class status updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update class status",
      })
    }
  }

  const handleNotesUpdate = async (classId: string) => {
    try {
      await classesAPI.update(classId, { notes: editingNotes[classId] })
      toast({
        title: "Success",
        description: "Notes updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notes",
      })
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedMonth)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setSelectedMonth(newDate)
  }

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Student not found</p>
            <Button className="mt-4" onClick={() => router.push("/students")}>
              Back to Students
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="ltr">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Dashboard
        </Button>
      </div>

      {/* Student Info Card - Full Width */}
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <Avatar className="h-32 w-32">
              <AvatarImage src={`/placeholder_svg_128px.png?height=128&width=128`} />
              <AvatarFallback className="text-3xl bg-yellow-100 text-yellow-700">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Student Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={student.status === "active" ? "default" : "secondary"}
                    className={
                      student.status === "active"
                        ? "bg-green-500"
                        : student.status === "inactive"
                          ? "bg-gray-500"
                          : "bg-blue-500"
                    }
                  >
                    {student.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{student.grade || student.subject}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>

                {student.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{student.phone}</p>
                    </div>
                  </div>
                )}

                {student.age && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{student.age} years</p>
                    </div>
                  </div>
                )}

                {student.enrollment_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Enrolled</p>
                      <p className="font-medium">{new Date(student.enrollment_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {student.parent_name && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Parent</p>
                      <p className="font-medium">{student.parent_name}</p>
                    </div>
                  </div>
                )}

                {student.parent_phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Parent Phone</p>
                      <p className="font-medium">{student.parent_phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {student.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{student.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.total_classes}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{monthlyStats.completed}</div>
            <p className="text-xs text-muted-foreground">Attended classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Cancelled</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{monthlyStats.student_cancelled}</div>
            <p className="text-xs text-muted-foreground">By student</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Cancelled</CardTitle>
            <UserX className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{monthlyStats.teacher_cancelled}</div>
            <p className="text-xs text-muted-foreground">By teacher</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monthlyStats.total_hours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Classes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>
                {selectedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
                Previous Month
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
                Current Month
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                Next Month
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Egypt Time</TableHead>
                  <TableHead>Student Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No classes scheduled for this month
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{getDayName(new Date(classItem.class_date))}</TableCell>
                      <TableCell>{classItem.class_date}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatEgyptTime(classItem.start_time)}</span>
                          <span className="text-xs text-gray-500">to {formatEgyptTime(classItem.end_time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatStudentTime(classItem.start_time, "UTC")}</span>
                          <span className="text-xs text-gray-500">
                            to {formatStudentTime(classItem.end_time, "UTC")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{classItem.duration} min</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={classItem.status}
                          onValueChange={(value) => handleStatusChange(classItem.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Textarea
                            value={editingNotes[classItem.id] || ""}
                            onChange={(e) =>
                              setEditingNotes({
                                ...editingNotes,
                                [classItem.id]: e.target.value,
                              })
                            }
                            placeholder="Add notes..."
                            className="min-w-[200px]"
                            rows={2}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleNotesUpdate(classItem.id)}
                            disabled={editingNotes[classItem.id] === classItem.notes}
                          >
                            Save
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
    </div>
  )
}
