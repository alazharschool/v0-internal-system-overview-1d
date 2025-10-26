"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, GraduationCap, Calendar, BookOpen, Edit, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { dashboardAPI, classesAPI, trialClassesAPI, type Class, type DashboardStats } from "@/lib/database"
import { formatTime12Hour, getCurrentDateTime } from "@/utils/time-format"
import { redirect } from "next/navigation"
import { EditClassModal } from "@/components/modals/edit-class-modal"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayClasses, setTodayClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDateTime, setCurrentDateTime] = useState<{ date: string; time: string }>({ date: "", time: "" })
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
    updateDateTime()
    const dateTimeInterval = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(dateTimeInterval)
  }, [])

  const updateDateTime = () => {
    setCurrentDateTime(getCurrentDateTime())
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, classesData, trialClassesData] = await Promise.all([
        dashboardAPI.getStats(),
        classesAPI.getAll(),
        trialClassesAPI.getAll(),
      ])

      setStats(statsData)

      // Filter today's classes
      const today = new Date().toISOString().split("T")[0]

      // Convert trial classes to class format
      const convertedTrialClasses: Class[] = trialClassesData
        .filter((trial) => trial.date === today && trial.status !== "cancelled")
        .map((trial) => ({
          id: `trial-${trial.id}`,
          student_id: "",
          teacher_id: trial.teacher_id || "",
          subject: trial.subject,
          class_date: trial.date,
          start_time: trial.time,
          end_time: "",
          duration: trial.duration,
          status: trial.status as any,
          notes: `Trial Class - ${trial.student_name}`,
          student: { name: trial.student_name, phone: trial.student_phone },
          teacher: trial.teacher,
          created_at: "",
          updated_at: "",
          isTrialClass: true,
        })) as any

      const regularClasses = classesData.filter((c) => c.class_date === today)
      const allClasses = [...regularClasses, ...convertedTrialClasses]

      // Sort by start time
      allClasses.sort((a, b) => a.start_time.localeCompare(b.start_time))

      setTodayClasses(allClasses)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (classId: string, newStatus: string) => {
    try {
      if (classId.startsWith("trial-")) {
        const trialId = classId.replace("trial-", "")
        await trialClassesAPI.update(trialId, { status: newStatus as any })
      } else {
        await classesAPI.update(classId, { status: newStatus as any })
      }

      // Update local state
      setTodayClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, status: newStatus as any } : c)))

      toast({
        title: "Success",
        description: "Class status updated successfully!",
      })

      await loadDashboardData()
    } catch (error) {
      console.error("Error updating class status:", error)
      toast({
        title: "Error",
        description: "Failed to update class status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "no_show":
        return <Badge className="bg-yellow-100 text-yellow-800">No Show</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusSelectColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "border-blue-500 bg-blue-50"
      case "completed":
        return "border-green-500 bg-green-50"
      case "cancelled":
        return "border-red-500 bg-red-50"
      case "no_show":
        return "border-yellow-500 bg-yellow-50"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Date and Time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50 to-amber-50 p-6 rounded-lg border border-blue-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome to Al-Azhar Online School Management System</p>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">{currentDateTime.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-lg font-semibold">{currentDateTime.time}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_students || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.active_students || 0} active students</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_teachers || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.active_teachers || 0} active teachers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Classes</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.length}</div>
            <p className="text-xs text-muted-foreground">Classes scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayClasses.filter((c) => (c as any).isTrialClass).length}</div>
            <p className="text-xs text-muted-foreground">Trial classes today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Classes Schedule</CardTitle>
              <CardDescription>All scheduled classes and trial sessions for today</CardDescription>
            </div>
            <Button asChild>
              <Link href="/schedule">View All Classes</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayClasses.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p className="text-lg font-medium">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Student Info</TableHead>
                    <TableHead>Teacher Info</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayClasses.map((classItem) => (
                    <TableRow key={classItem.id} className={(classItem as any).isTrialClass ? "bg-orange-50" : ""}>
                      <TableCell>
                        {(classItem as any).isTrialClass ? (
                          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            Trial
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">Regular</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{formatTime12Hour(classItem.start_time)}</p>
                          <p className="text-xs text-slate-600">Egypt Time</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`/students/${classItem.student_id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {classItem.student?.name || "Unknown"}
                          </Link>
                          <p className="text-sm text-slate-600">{classItem.student?.phone || "No phone"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {classItem.teacher ? (
                            <>
                              <Link
                                href={`/teachers/${classItem.teacher_id}`}
                                className="font-medium text-green-600 hover:text-green-800 hover:underline cursor-pointer"
                              >
                                {classItem.teacher?.name || "Unassigned"}
                              </Link>
                              <p className="text-sm text-slate-600">{classItem.teacher?.phone || "No phone"}</p>
                            </>
                          ) : (
                            <p className="text-sm text-slate-600">Not assigned</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{classItem.subject}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{classItem.duration} min</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={classItem.status}
                          onValueChange={(value) => handleStatusChange(classItem.id, value)}
                        >
                          <SelectTrigger className={`w-[130px] border-2 ${getStatusSelectColor(classItem.status)}`}>
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
                        {!classItem.id.startsWith("trial-") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingClass(classItem)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/students?action=add">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Add Student
              </CardTitle>
              <CardDescription>Register a new student</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/teachers?action=add">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                Add Teacher
              </CardTitle>
              <CardDescription>Register a new teacher</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/trial-classes?action=add">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                Schedule Trial
              </CardTitle>
              <CardDescription>Schedule a trial class</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>

      {/* Edit Class Modal */}
      <EditClassModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingClass(null)
        }}
        classItem={editingClass}
        onSuccess={loadDashboardData}
      />
    </div>
  )
}

export function RootPage() {
  redirect("/dashboard")
}
