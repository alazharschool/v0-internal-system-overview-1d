"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  GraduationCap,
  RefreshCw,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Class {
  id: string
  student_id: string
  teacher_id: string
  subject: string
  class_date: string
  start_time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
  student?: { name: string; phone: string }
  teacher?: { name: string; phone: string }
}

// Custom Hook for Schedule Page Actions
function useSchedulePageActions() {
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { toast } = useToast()

  const loadClasses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/classes")
      if (!response.ok) throw new Error("Failed to load classes")
      const data = await response.json()
      setClasses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading classes:", error)
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  useEffect(() => {
    const getWeekStart = (date: Date) => {
      const start = new Date(date)
      const day = start.getDay()
      const diff = start.getDate() - day
      start.setDate(diff)
      start.setHours(0, 0, 0, 0)
      return start
    }

    const getWeekEnd = (date: Date) => {
      const end = getWeekStart(date)
      end.setDate(end.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      return end
    }

    const weekStart = getWeekStart(currentWeek)
    const weekEnd = getWeekEnd(currentWeek)

    let filtered = classes.filter((classItem) => {
      const classDate = new Date(classItem.class_date)
      return classDate >= weekStart && classDate <= weekEnd
    })

    if (searchTerm) {
      filtered = filtered.filter(
        (classItem) =>
          classItem.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classItem.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((classItem) => classItem.status === statusFilter)
    }

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.class_date}T${a.start_time}`)
      const dateB = new Date(`${b.class_date}T${b.start_time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredClasses(filtered)
  }, [classes, searchTerm, statusFilter, currentWeek])

  const handleStatusChange = useCallback(
    async (classId: string, newStatus: string) => {
      try {
        let statusUpdate = ""
        let noteUpdate = ""

        switch (newStatus) {
          case "attend":
            statusUpdate = "completed"
            noteUpdate = "Student attended the class"
            break
          case "cancel_student":
            statusUpdate = "cancelled"
            noteUpdate = "Cancelled by student"
            break
          case "cancel_teacher":
            statusUpdate = "cancelled"
            noteUpdate = "Cancelled by teacher"
            break
          case "scheduled":
            statusUpdate = "scheduled"
            noteUpdate = "Class scheduled"
            break
          default:
            return
        }

        const response = await fetch(`/api/classes/${classId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusUpdate, notes: noteUpdate }),
        })

        if (!response.ok) throw new Error("Failed to update status")

        setClasses((prev) =>
          prev.map((c) => (c.id === classId ? { ...c, status: statusUpdate as any, notes: noteUpdate } : c)),
        )

        toast({
          title: "Success",
          description: `Class status updated to ${statusUpdate}`,
        })
      } catch (error) {
        console.error("Error updating class status:", error)
        toast({
          title: "Error",
          description: "Failed to update class status. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleDeleteClass = useCallback(
    async (classId: string) => {
      if (!window.confirm("Are you sure you want to delete this class?")) return

      try {
        const response = await fetch(`/api/classes/${classId}`, { method: "DELETE" })
        if (!response.ok) throw new Error("Failed to delete")

        setClasses((prev) => prev.filter((c) => c.id !== classId))
        toast({
          title: "Success",
          description: "Class deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting class:", error)
        toast({
          title: "Error",
          description: "Failed to delete class. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleRefresh = useCallback(async () => {
    try {
      await loadClasses()
      toast({
        title: "Refreshed",
        description: "Schedule updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh. Please try again.",
      })
    }
  }, [loadClasses, toast])

  const getWeekRange = () => {
    const getWeekStart = (date: Date) => {
      const start = new Date(date)
      const day = start.getDay()
      const diff = start.getDate() - day
      start.setDate(diff)
      return start
    }

    const getWeekEnd = (date: Date) => {
      const end = getWeekStart(date)
      end.setDate(end.getDate() + 6)
      return end
    }

    const start = getWeekStart(currentWeek)
    const end = getWeekEnd(currentWeek)
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
      return newDate
    })
  }

  return {
    classes,
    filteredClasses,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentWeek,
    navigateWeek,
    getWeekRange,
    handleStatusChange,
    handleDeleteClass,
    handleRefresh,
    loadClasses,
  }
}

export default function SchedulePage() {
  const actions = useSchedulePageActions()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
      case "no_show":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            No Show
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStats = () => {
    const total = actions.filteredClasses.length
    const scheduled = actions.filteredClasses.filter((c) => c.status === "scheduled").length
    const completed = actions.filteredClasses.filter((c) => c.status === "completed").length
    const cancelled = actions.filteredClasses.filter((c) => c.status === "cancelled").length

    return { total, scheduled, completed, cancelled }
  }

  const stats = getStats()

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (actions.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Class Schedule
            </h1>
            <p className="text-slate-600">Manage and organize all class schedules</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={actions.handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Class
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Classes</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sky-700 font-medium text-sm">Scheduled</p>
                  <p className="text-3xl font-bold text-sky-900">{stats.scheduled}</p>
                </div>
                <div className="w-12 h-12 bg-sky-200 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sky-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Completed</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-rose-700 font-medium text-sm">Cancelled</p>
                  <p className="text-3xl font-bold text-rose-900">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-rose-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Week Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => actions.navigateWeek("prev")}
                  className="border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-center px-4">
                  <p className="font-semibold text-slate-900">{actions.getWeekRange()}</p>
                  <p className="text-xs text-slate-600">Week Schedule</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => actions.navigateWeek("next")}
                  className="border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search classes..."
                    value={actions.searchTerm}
                    onChange={(e) => actions.setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-white border-slate-200"
                  />
                </div>
                <Select value={actions.statusFilter} onValueChange={actions.setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-slate-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {actions.filteredClasses.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Classes This Week</h3>
                <p className="text-slate-600 mb-6">There are no scheduled classes for this week.</p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Class
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-bold text-slate-700 text-center">#</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Date</TableHead>
                        <TableHead className="font-bold text-slate-700">Student</TableHead>
                        <TableHead className="font-bold text-slate-700">Teacher</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Subject</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Time</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Duration</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actions.filteredClasses.map((classItem, index) => (
                        <TableRow key={classItem.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="text-center font-medium text-slate-600">{index + 1}</TableCell>

                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-semibold text-slate-900">
                                {new Date(classItem.class_date).toLocaleDateString("en-US", { weekday: "short" })}
                              </div>
                              <div className="text-sm text-slate-600">{formatDate(classItem.class_date)}</div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Link
                              href={`/students/${classItem.student_id}`}
                              className="flex items-center gap-2 group hover:bg-blue-50 rounded-lg p-2 transition-colors"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                                  {classItem.student?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-slate-500">{classItem.student?.phone || "No phone"}</div>
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell>
                            <Link
                              href={`/teachers/${classItem.teacher_id}`}
                              className="flex items-center gap-2 group hover:bg-emerald-50 rounded-lg p-2 transition-colors"
                            >
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-emerald-600 group-hover:text-emerald-800 transition-colors">
                                  {classItem.teacher?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-slate-500">{classItem.teacher?.phone || "No phone"}</div>
                              </div>
                            </Link>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                              {classItem.subject}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-semibold text-slate-900">{formatTime(classItem.start_time)}</div>
                              <div className="text-xs text-slate-500">Egypt Time</div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="font-medium text-slate-600">{classItem.duration} min</span>
                          </TableCell>

                          <TableCell className="text-center">
                            <Select
                              value={
                                classItem.status === "completed"
                                  ? "attend"
                                  : classItem.status === "cancelled"
                                    ? classItem.notes?.toLowerCase().includes("student")
                                      ? "cancel_student"
                                      : "cancel_teacher"
                                    : "scheduled"
                              }
                              onValueChange={(value) => actions.handleStatusChange(classItem.id, value)}
                            >
                              <SelectTrigger className="w-40 mx-auto border-slate-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">
                                  <div className="flex items-center text-blue-700">
                                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                    Scheduled
                                  </div>
                                </SelectItem>
                                <SelectItem value="attend">
                                  <div className="flex items-center text-emerald-700">
                                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                                    Attend
                                  </div>
                                </SelectItem>
                                <SelectItem value="cancel_student">
                                  <div className="flex items-center text-red-700">
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Cancel (Student)
                                  </div>
                                </SelectItem>
                                <SelectItem value="cancel_teacher">
                                  <div className="flex items-center text-orange-700">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                                    Cancel (Teacher)
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Class
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => actions.handleDeleteClass(classItem.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Class
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
