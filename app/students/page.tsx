"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Users, UserCheck, UserX, GraduationCap, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { AddStudentModal } from "@/components/modals/add-student-modal"
import { studentsAPI, type Student } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { toastMessages } from "@/utils/toast-messages"

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchQuery, statusFilter])

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

  const filterStudents = () => {
    let filtered = students

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    setFilteredStudents(filtered)
  }

  const handleAddStudent = async (studentData: any) => {
    try {
      await studentsAPI.create(studentData)
      await loadStudents()
      setIsAddModalOpen(false)
      toast({
        title: toastMessages.student.addSuccess.title,
        description: toastMessages.student.addSuccess.description,
        className: "bg-green-50 border-green-200",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: toastMessages.student.addError.title,
        description: toastMessages.student.addError.description,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      active: { variant: "default", label: "Active", className: "bg-green-500" },
      inactive: { variant: "secondary", label: "Inactive" },
      graduated: { variant: "default", label: "Graduated", className: "bg-blue-500" },
    }
    const config = variants[status] || variants.active
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const activeStudents = students.filter((s) => s.status === "active").length
  const inactiveStudents = students.filter((s) => s.status === "inactive").length
  const graduatedStudents = students.filter((s) => s.status === "graduated").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="ltr">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-500">Manage and track all student information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">All registered students</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStudents}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
            <UserX className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{inactiveStudents}</div>
            <p className="text-xs text-muted-foreground">Temporarily inactive</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{graduatedStudents}</div>
            <p className="text-xs text-muted-foreground">Completed programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Search and filter student records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.subject || student.grade}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
                            View Details
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

      {/* Add Student Modal */}
      <AddStudentModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onSubmit={handleAddStudent} />
    </div>
  )
}
