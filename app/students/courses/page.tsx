"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  BookOpen,
  GraduationCap,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { coursesAPI, type Course } from "@/lib/database"
import { AddCourseModal } from "@/components/modals/add-course-modal"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, statusFilter, subjectFilter])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const coursesData = await coursesAPI.getAll()
      setCourses(coursesData)
    } catch (error) {
      console.error("Error loading courses:", error)
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter)
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter((course) => course.subject === subjectFilter)
    }

    setFilteredCourses(filtered)
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await coursesAPI.delete(courseId)
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      })
      loadCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>
      case "paused":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Paused</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500"
    if (percentage >= 60) return "bg-blue-500"
    if (percentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const getUniqueSubjects = () => {
    const subjects = courses.map((course) => course.subject)
    return [...new Set(subjects)]
  }

  const getCourseStats = () => {
    const total = courses.length
    const active = courses.filter((c) => c.status === "active").length
    const completed = courses.filter((c) => c.status === "completed").length
    const avgProgress =
      courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.progress_percentage, 0) / courses.length) : 0

    return { total, active, completed, avgProgress }
  }

  const stats = getCourseStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 lg:ml-64">
            <div className="sticky top-0 z-40 lg:hidden">
              <div className="flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6">
                <MobileSidebar />
                <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Student Courses</div>
              </div>
            </div>
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                  </div>
                  <div className="h-96 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 lg:hidden">
            <div className="flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6">
              <MobileSidebar />
              <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Student Courses</div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
                      Student Courses
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                      Manage and track all student course enrollments and progress
                    </p>
                  </div>
                  <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-blue-100" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-blue-100 truncate">Total Courses</dt>
                          <dd className="text-2xl font-bold text-white">{stats.total}</dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-8 w-8 text-emerald-100" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-emerald-100 truncate">Active Courses</dt>
                          <dd className="text-2xl font-bold text-white">{stats.active}</dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <GraduationCap className="h-8 w-8 text-purple-100" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-purple-100 truncate">Completed</dt>
                          <dd className="text-2xl font-bold text-white">{stats.completed}</dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-amber-100" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-amber-100 truncate">Avg Progress</dt>
                          <dd className="text-2xl font-bold text-white">{stats.avgProgress}%</dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6 shadow-sm border-slate-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by student, teacher, or subject..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          {getUniqueSubjects().map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Courses Table */}
              <Card className="shadow-lg border-slate-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    Course Management
                  </CardTitle>
                  <CardDescription>Track student progress and manage course enrollments</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                      <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Courses Found</h3>
                      <p className="text-slate-600 mb-6">
                        {searchTerm || statusFilter !== "all" || subjectFilter !== "all"
                          ? "No courses match your current filters."
                          : "Start by adding your first course."}
                      </p>
                      <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Course
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="font-bold text-slate-700">Student</TableHead>
                            <TableHead className="font-bold text-slate-700">Teacher</TableHead>
                            <TableHead className="font-bold text-slate-700">Subject</TableHead>
                            <TableHead className="font-bold text-slate-700">Progress</TableHead>
                            <TableHead className="font-bold text-slate-700">Classes</TableHead>
                            <TableHead className="font-bold text-slate-700">Duration</TableHead>
                            <TableHead className="font-bold text-slate-700">Status</TableHead>
                            <TableHead className="font-bold text-slate-700">Monthly Fee</TableHead>
                            <TableHead className="font-bold text-slate-700">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCourses.map((course) => (
                            <TableRow key={course.id} className="hover:bg-slate-50">
                              <TableCell>
                                <div className="space-y-1">
                                  <Link
                                    href={`/students/${course.student_id}`}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                  >
                                    {course.student?.name || "Unknown Student"}
                                  </Link>
                                  <p className="text-sm text-slate-500">{course.student?.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Link
                                    href={`/teachers/${course.teacher_id}`}
                                    className="font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition-colors"
                                  >
                                    {course.teacher?.name || "Unknown Teacher"}
                                  </Link>
                                  <p className="text-sm text-slate-500">${course.teacher?.hourly_rate}/hr</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  {course.subject}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{course.progress_percentage}%</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                        course.progress_percentage,
                                      )}`}
                                      style={{ width: `${course.progress_percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-center">
                                  <div className="font-semibold text-slate-900">
                                    {course.completed_classes}/{course.total_classes}
                                  </div>
                                  <div className="text-sm text-slate-500">{course.remaining_classes} remaining</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="font-medium text-slate-900">
                                    {new Date(course.start_date).toLocaleDateString()}
                                  </div>
                                  <div className="text-slate-500">to</div>
                                  <div className="font-medium text-slate-900">
                                    {new Date(course.end_date).toLocaleDateString()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(course.status)}</TableCell>
                              <TableCell>
                                <div className="font-semibold text-slate-900">${course.monthly_fee}</div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Course
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteCourse(course.id)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Course
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false)
          loadCourses()
        }}
      />
    </div>
  )
}
