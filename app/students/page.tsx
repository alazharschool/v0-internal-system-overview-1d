"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AddStudentModal } from "@/components/modals/add-student-modal"
import { ScheduleClassModal } from "@/components/modals/schedule-class-modal"
import { EditStudentModal } from "@/components/modals/edit-student-modal"
import {
  Search,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Home,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  name: string
  email: string
  phone?: string
  grade?: string
  subject?: string
  status: "active" | "inactive" | "graduated"
}

// Custom Hook for Page Actions
function useStudentPageActions() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/students")
      if (!response.ok) throw new Error("Failed to fetch students")
      const data = await response.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading students:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load students. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, statusFilter])

  const handleAddStudent = useCallback(() => {
    setIsAddModalOpen(true)
  }, [])

  const handleScheduleClass = useCallback((student: Student) => {
    setSelectedStudent(student)
    setIsScheduleModalOpen(true)
  }, [])

  const handleEditStudent = useCallback((student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }, [])

  const handleDeleteStudent = useCallback(
    async (id: string, name: string) => {
      if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

      try {
        const response = await fetch(`/api/students/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error("Failed to delete")

        toast({
          title: "Success",
          description: "Student deleted successfully",
        })
        await loadStudents()
      } catch (error) {
        console.error("Error deleting student:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete student. Please try again.",
        })
      }
    },
    [toast, loadStudents],
  )

  const handleViewDetails = useCallback(
    (studentId: string) => {
      router.push(`/students/${studentId}`)
    },
    [router],
  )

  const handleRefresh = useCallback(async () => {
    try {
      await loadStudents()
      toast({
        title: "Refreshed",
        description: "Student list updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh. Please try again.",
      })
    }
  }, [loadStudents, toast])

  return {
    students,
    filteredStudents,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedStudent,
    handleAddStudent,
    handleScheduleClass,
    handleEditStudent,
    handleDeleteStudent,
    handleViewDetails,
    handleRefresh,
    loadStudents,
  }
}

export default function StudentsPage() {
  const actions = useStudentPageActions()

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      inactive: { bg: "bg-gray-100", text: "text-gray-800", label: "Inactive" },
      graduated: { bg: "bg-blue-100", text: "text-blue-800", label: "Graduated" },
    }
    const config = statusConfig[status] || statusConfig.active
    return <Badge className={`${config.bg} ${config.text} border-none`}>{config.label}</Badge>
  }

  const stats = {
    total: actions.students.length,
    active: actions.students.filter((s) => s.status === "active").length,
    inactive: actions.students.filter((s) => s.status === "inactive").length,
    graduated: actions.students.filter((s) => s.status === "graduated").length,
  }

  if (actions.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

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
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Students Management
              </h1>
              <p className="text-slate-600 text-lg">Manage and track all student information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={actions.handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={actions.handleAddStudent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Active</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium text-sm">Inactive</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserX className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-purple-700 font-medium text-sm">Graduated</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.graduated}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search students by name or email..."
                    value={actions.searchTerm}
                    onChange={(e) => actions.setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <select
                value={actions.statusFilter}
                onChange={(e) => actions.setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Students Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>Showing {actions.filteredStudents.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">#</TableHead>
                    <TableHead className="font-semibold text-slate-700">Name</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                    <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4">
                          {actions.searchTerm || actions.statusFilter !== "all"
                            ? "No students match your filters"
                            : "No students found"}
                        </p>
                        {!actions.searchTerm && actions.statusFilter === "all" && (
                          <Button onClick={actions.handleAddStudent} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Student
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    actions.filteredStudents.map((student, index) => (
                      <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8 ring-2 ring-slate-200">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-semibold">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-slate-900">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{student.email}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{student.phone || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.subject || student.grade}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.handleScheduleClass(student)}
                              title="Schedule New Class"
                              className="h-8 w-8 p-0"
                            >
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.handleEditStudent(student)}
                              title="Edit Student"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4 text-amber-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.handleViewDetails(student.id)}
                              title="View Details"
                              className="h-8 w-8 p-0"
                            >
                              <Users className="h-4 w-4 text-emerald-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => actions.handleDeleteStudent(student.id, student.name)}
                              title="Delete Student"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* Modals */}
      <AddStudentModal
        open={actions.isAddModalOpen}
        onOpenChange={actions.setIsAddModalOpen}
        onStudentAdded={actions.loadStudents}
      />

      {actions.selectedStudent && (
        <>
          <ScheduleClassModal
            isOpen={actions.isScheduleModalOpen}
            onClose={() => actions.setIsScheduleModalOpen(false)}
            studentId={actions.selectedStudent.id}
            onSuccess={actions.loadStudents}
          />
          <EditStudentModal
            isOpen={actions.isEditModalOpen}
            onClose={() => actions.setIsEditModalOpen(false)}
            onSuccess={actions.loadStudents}
            student={actions.selectedStudent}
          />
        </>
      )}
    </div>
  )
}
