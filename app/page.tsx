"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, GraduationCap, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { dashboardAPI, classesAPI, type Class, type DashboardStats } from "@/lib/database"
import { formatEgyptTime, formatStudentTime, formatDateWithDay, getDayName } from "@/utils/time-format"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayClasses, setTodayClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, classesData] = await Promise.all([dashboardAPI.getStats(), classesAPI.getAll()])

      setStats(statsData)

      // Filter today's classes
      const today = new Date().toISOString().split("T")[0]
      const todayClassesFiltered = classesData.filter((c) => c.class_date === today)
      setTodayClasses(todayClassesFiltered)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (classId: string, newStatus: string) => {
    try {
      await classesAPI.update(classId, { status: newStatus as any })
      await loadDashboardData()
    } catch (error) {
      console.error("Error updating class status:", error)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome to Al-Azhar Online School Management System</p>
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
            <p className="text-xs text-muted-foreground">{formatDateWithDay(new Date())}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_trial_classes || 0}</div>
            <p className="text-xs text-muted-foreground">Pending trials</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Classes</CardTitle>
              <CardDescription>
                {getDayName(new Date())}, {new Date().toLocaleDateString()}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/schedule">View All Classes</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>No classes scheduled for today</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student Info</TableHead>
                    <TableHead>Teacher Info</TableHead>
                    <TableHead>Egypt Time</TableHead>
                    <TableHead>Student Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{getDayName(classItem.class_date)}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(classItem.class_date).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`/students/${classItem.student_id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {classItem.student?.name || "Unknown"}
                          </Link>
                          <p className="text-sm text-slate-600">{classItem.student?.phone || "No phone"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`/teachers/${classItem.teacher_id}`}
                            className="font-medium text-green-600 hover:text-green-800 hover:underline"
                          >
                            {classItem.teacher?.name || "Unknown"}
                          </Link>
                          <p className="text-sm text-slate-600">{classItem.teacher?.phone || "No phone"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{formatEgyptTime(classItem.start_time)}</p>
                          <p className="text-sm text-slate-600">to {formatEgyptTime(classItem.end_time)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {formatStudentTime(classItem.start_time, classItem.student?.address || "")}
                          </p>
                          <p className="text-sm text-slate-600">
                            to {formatStudentTime(classItem.end_time, classItem.student?.address || "")}
                          </p>
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
                          <SelectTrigger className="w-[130px]">
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
                        <p className="text-sm text-slate-600 max-w-xs truncate">{classItem.notes || "No notes"}</p>
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
    </div>
  )
}

export function RootPage() {
  redirect("/dashboard")
}
