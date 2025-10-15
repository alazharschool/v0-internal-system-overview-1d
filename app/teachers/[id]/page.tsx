"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Clock,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Home,
  DollarSign,
  Star,
} from "lucide-react"
import { teachersAPI, classesAPI, type Teacher, type Class } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { formatTime, formatDateShort } from "@/utils/time-format"
import Link from "next/link"

export default function TeacherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadTeacherData(params.id as string)
    }
  }, [params.id])

  const loadTeacherData = async (teacherId: string) => {
    try {
      setLoading(true)
      const [teacherData, classesData] = await Promise.all([
        teachersAPI.getById(teacherId),
        getTeacherClasses(teacherId),
      ])

      if (!teacherData) {
        toast({
          title: "Error",
          description: "Teacher not found",
          variant: "destructive",
        })
        router.push("/teachers")
        return
      }

      setTeacher(teacherData)
      setClasses(classesData)
    } catch (error) {
      console.error("Error loading teacher data:", error)
      toast({
        title: "Error",
        description: "Failed to load teacher data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTeacherClasses = async (teacherId: string): Promise<Class[]> => {
    try {
      const allClasses = await classesAPI.getAll()
      return allClasses.filter((c) => c.teacher_id === teacherId)
    } catch (error) {
      console.error("Error loading teacher classes:", error)
      return []
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
      case "inactive":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getClassStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-sky-100 text-sky-800 border-sky-200">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Cancelled</Badge>
      case "no_show":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">No Show</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getClassStats = () => {
    const total = classes.length
    const completed = classes.filter((c) => c.status === "completed").length
    const scheduled = classes.filter((c) => c.status === "scheduled").length
    const cancelled = classes.filter((c) => c.status === "cancelled").length
    const totalHours = classes.filter((c) => c.status === "completed").reduce((sum, c) => sum + c.duration, 0) / 60

    return { total, completed, scheduled, cancelled, totalHours }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-slate-200 rounded"></div>
              <div className="h-8 bg-slate-200 rounded w-64"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Teacher Not Found</h2>
            <p className="text-slate-600 mb-6">The teacher you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/teachers">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Teachers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const classStats = getClassStats()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teachers">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Teachers
              </Link>
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">{teacher.name}</h1>
              <p className="text-slate-600">Teacher Profile & Teaching History</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-200 hover:bg-slate-50 bg-transparent">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-200 bg-transparent">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Teacher
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Teacher
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Teacher Information - Full Width */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20 ring-4 ring-slate-200">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xl font-bold">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">{teacher.name}</h2>
                  {getStatusBadge(teacher.status)}
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {teacher.email}
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {teacher.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />${teacher.hourly_rate}/hour
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-medium text-slate-700">Subject</p>
                    <p className="text-slate-600">{teacher.subject}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Join Date</p>
                    <p className="text-slate-600">{new Date(teacher.join_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Total Classes</p>
                    <p className="text-slate-600">{classStats.total}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Teaching Hours</p>
                    <p className="text-slate-600">{classStats.totalHours.toFixed(1)}h</p>
                  </div>
                </div>
              </div>
            </div>
            {teacher.bio && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Bio:</strong> {teacher.bio}
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teacher Statistics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Teaching Statistics */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Teaching Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-900">{classStats.total}</p>
                    <p className="text-sm text-blue-700">Total Classes</p>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-900">{classStats.completed}</p>
                    <p className="text-sm text-emerald-700">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-sky-50 rounded-lg">
                    <p className="text-2xl font-bold text-sky-900">{classStats.scheduled}</p>
                    <p className="text-sm text-sky-700">Scheduled</p>
                  </div>
                  <div className="text-center p-3 bg-rose-50 rounded-lg">
                    <p className="text-2xl font-bold text-rose-900">{classStats.cancelled}</p>
                    <p className="text-sm text-rose-700">Cancelled</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-3xl font-bold text-purple-900">{classStats.totalHours.toFixed(1)}</p>
                  <p className="text-sm text-purple-700">Total Teaching Hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{teacher.subject}</span>
                    <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                  </div>
                  {teacher.subjects && teacher.subjects.length > 1 && (
                    <div className="space-y-2">
                      {teacher.subjects.slice(1).map((subject, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-700">{subject}</span>
                          <Badge variant="outline">Secondary</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">4.8</p>
                  <p className="text-sm text-slate-600">Average Rating</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">
                      {classStats.total > 0 ? Math.round((classStats.completed / classStats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{
                        width: `${classStats.total > 0 ? (classStats.completed / classStats.total) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Teaching History
                </CardTitle>
                <CardDescription>Complete record of all classes taught by this teacher</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="space-y-4">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all">All Classes ({classes.length})</TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({classes.filter((c) => c.status === "completed").length})
                    </TabsTrigger>
                    <TabsTrigger value="scheduled">
                      Scheduled ({classes.filter((c) => c.status === "scheduled").length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                      Cancelled ({classes.filter((c) => c.status === "cancelled").length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {classes.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No classes found for this teacher</p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50">
                              <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                              <TableHead className="font-semibold text-slate-700">Student</TableHead>
                              <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                              <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                              <TableHead className="font-semibold text-slate-700">Status</TableHead>
                              <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {classes
                              .sort((a, b) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime())
                              .map((classItem) => (
                                <TableRow key={classItem.id} className="hover:bg-slate-50">
                                  <TableCell>
                                    <div className="space-y-1">
                                      <p className="font-medium text-slate-900">
                                        {formatDateShort(classItem.class_date)}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                      </p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Link
                                      href={`/students/${classItem.student_id}`}
                                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                                    >
                                      {classItem.student?.name || "Unknown Student"}
                                    </Link>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium text-slate-900">{classItem.subject}</span>
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-slate-600">{classItem.duration} min</span>
                                  </TableCell>
                                  <TableCell>{getClassStatusBadge(classItem.status)}</TableCell>
                                  <TableCell>
                                    <span className="text-sm text-slate-600">{classItem.notes || "No notes"}</span>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                            <TableHead className="font-semibold text-slate-700">Student</TableHead>
                            <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                            <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                            <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classes
                            .filter((c) => c.status === "completed")
                            .sort((a, b) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime())
                            .map((classItem) => (
                              <TableRow key={classItem.id} className="hover:bg-slate-50">
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="font-medium text-slate-900">
                                      {formatDateShort(classItem.class_date)}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`/students/${classItem.student_id}`}
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                                  >
                                    {classItem.student?.name || "Unknown Student"}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-slate-900">{classItem.subject}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-slate-600">{classItem.duration} min</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-slate-600">{classItem.notes || "No notes"}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="scheduled">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                            <TableHead className="font-semibold text-slate-700">Student</TableHead>
                            <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                            <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                            <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classes
                            .filter((c) => c.status === "scheduled")
                            .sort((a, b) => new Date(a.class_date).getTime() - new Date(b.class_date).getTime())
                            .map((classItem) => (
                              <TableRow key={classItem.id} className="hover:bg-slate-50">
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="font-medium text-slate-900">
                                      {formatDateShort(classItem.class_date)}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`/students/${classItem.student_id}`}
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                                  >
                                    {classItem.student?.name || "Unknown Student"}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-slate-900">{classItem.subject}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-slate-600">{classItem.duration} min</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-slate-600">{classItem.notes || "No notes"}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="cancelled">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                            <TableHead className="font-semibold text-slate-700">Student</TableHead>
                            <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                            <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                            <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classes
                            .filter((c) => c.status === "cancelled")
                            .sort((a, b) => new Date(b.class_date).getTime() - new Date(a.class_date).getTime())
                            .map((classItem) => (
                              <TableRow key={classItem.id} className="hover:bg-slate-50">
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="font-medium text-slate-900">
                                      {formatDateShort(classItem.class_date)}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Link
                                    href={`/students/${classItem.student_id}`}
                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                                  >
                                    {classItem.student?.name || "Unknown Student"}
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-slate-900">{classItem.subject}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-slate-600">{classItem.duration} min</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-slate-600">{classItem.notes || "No notes"}</span>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
