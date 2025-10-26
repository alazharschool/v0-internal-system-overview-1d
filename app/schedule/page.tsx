"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Home, RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ScheduleClass {
  id: string
  student_id: string
  student_name: string
  teacher_name: string
  country?: string
  day: string
  start_time: string
  duration: number
  status: "attended" | "absent" | "no_class" | "scheduled"
  notes?: string
}

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  age?: number
  grade?: string
  subject?: string
  parent_name?: string
  parent_phone?: string
  parent_email?: string
  address?: string
  status: string
  enrollment_date?: string
  notes?: string
  created_at?: string
  updated_at?: string
  weekly_schedule?: Array<{
    day: string
    start_time: string
    end_time: string
    subject: string
  }>
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function useSchedulePage() {
  const [classes, setClasses] = useState<ScheduleClass[]>([])
  const [filteredClasses, setFilteredClasses] = useState<ScheduleClass[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [todayDay, setTodayDay] = useState<string>("")
  const { toast } = useToast()

  // Get today's day
  useEffect(() => {
    const today = new Date()
    const dayIndex = today.getDay()
    const dayName = DAYS_OF_WEEK[dayIndex]
    setTodayDay(dayName)
    setSelectedDay(dayName)
  }, [])

  // Load classes from students' weekly schedule
  const loadClasses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/students")
      if (!response.ok) throw new Error("Failed to load students")

      const students: Student[] = await response.json()

      // Extract classes from student weekly schedules
      const extractedClasses: ScheduleClass[] = []

      students.forEach((student) => {
        if (student.weekly_schedule && Array.isArray(student.weekly_schedule)) {
          student.weekly_schedule.forEach((schedule) => {
            extractedClasses.push({
              id: `${student.id}-${schedule.day}-${schedule.start_time}`,
              student_id: student.id,
              student_name: student.name,
              teacher_name: "Teacher Name", // Will be updated if teacher info is available
              country: student.address || "Egypt",
              day: schedule.day,
              start_time: schedule.start_time,
              duration: 60, // Default duration
              status: "scheduled",
              notes: `${schedule.subject}`,
            })
          })
        }
      })

      setClasses(extractedClasses)
      toast({
        title: "Success",
        description: "Classes loaded successfully",
      })
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

  // Load classes on mount
  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  // Filter classes by selected day
  useEffect(() => {
    const filtered = classes.filter((c) => c.day === selectedDay)
    filtered.sort((a, b) => {
      const timeA = Number.parseInt(a.start_time.replace(":", ""))
      const timeB = Number.parseInt(b.start_time.replace(":", ""))
      return timeA - timeB
    })
    setFilteredClasses(filtered)
  }, [classes, selectedDay])

  const handleStatusChange = useCallback(
    async (classId: string, newStatus: string) => {
      try {
        setClasses((prev) =>
          prev.map((c) =>
            c.id === classId ? { ...c, status: newStatus as "attended" | "absent" | "no_class" | "scheduled" } : c,
          ),
        )

        toast({
          title: "Success",
          description: `Status updated to ${newStatus}`,
        })
      } catch (error) {
        console.error("Error updating status:", error)
        toast({
          title: "Error",
          description: "Failed to update status",
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
        description: "Failed to refresh",
      })
    }
  }, [loadClasses, toast])

  return {
    classes,
    filteredClasses,
    loading,
    selectedDay,
    setSelectedDay,
    todayDay,
    handleStatusChange,
    handleRefresh,
  }
}

export default function SchedulePage() {
  const { filteredClasses, loading, selectedDay, setSelectedDay, todayDay, handleStatusChange, handleRefresh } =
    useSchedulePage()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Attended
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        )
      case "no_class":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            No Class
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
      return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`
    } catch {
      return time
    }
  }

  if (loading) {
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
            <p className="text-slate-600">View and manage daily class attendance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium text-sm">Total Classes Today</p>
                  <p className="text-3xl font-bold text-blue-900">{filteredClasses.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 font-medium text-sm">Attended</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {filteredClasses.filter((c) => c.status === "attended").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-700 font-medium text-sm">Absent</p>
                  <p className="text-3xl font-bold text-rose-900">
                    {filteredClasses.filter((c) => c.status === "absent").length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Filter */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">
                  {selectedDay === todayDay ? "Today's Schedule" : `${selectedDay}'s Schedule`}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">{selectedDay === todayDay && `Today is ${todayDay}`}</p>
              </div>
              <div className="w-full sm:w-48">
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Classes Table */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Classes Today</h3>
                <p className="text-slate-600">There are no scheduled classes for {selectedDay}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-bold text-slate-700">#</TableHead>
                        <TableHead className="font-bold text-slate-700">Student Name</TableHead>
                        <TableHead className="font-bold text-slate-700">Teacher Name</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Country</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Day</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Time</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                        <TableHead className="font-bold text-slate-700 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClasses.map((classItem, index) => (
                        <TableRow key={classItem.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>

                          <TableCell>
                            <Link
                              href={`/students/${classItem.student_id}`}
                              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              {classItem.student_name}
                            </Link>
                          </TableCell>

                          <TableCell className="text-slate-700">{classItem.teacher_name}</TableCell>

                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-slate-100 text-slate-800">
                              {classItem.country || "N/A"}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="font-medium text-slate-700">{classItem.day}</span>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-semibold text-slate-900">{formatTime(classItem.start_time)}</div>
                              <div className="text-xs text-slate-500">{classItem.duration} min</div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">{getStatusBadge(classItem.status)}</TableCell>

                          <TableCell className="text-center">
                            <Select
                              value={classItem.status}
                              onValueChange={(value) => handleStatusChange(classItem.id, value)}
                            >
                              <SelectTrigger className="w-32 mx-auto border-slate-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                    Scheduled
                                  </div>
                                </SelectItem>
                                <SelectItem value="attended">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                                    Attended
                                  </div>
                                </SelectItem>
                                <SelectItem value="absent">
                                  <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-2 text-rose-600" />
                                    Absent
                                  </div>
                                </SelectItem>
                                <SelectItem value="no_class">
                                  <div className="flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2 text-gray-600" />
                                    No Class
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
