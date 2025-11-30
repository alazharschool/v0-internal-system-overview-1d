"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { studentsAPI, teachersAPI, lessonsAPI, type Lesson } from "@/lib/database"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function DashboardPage() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, todayLessons: 0, totalLessons: 0 })
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      const [students, teachers, lessons] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        lessonsAPI.getAll(),
      ])

      const todayLessonsData = await lessonsAPI.getTodayLessons()

      setStats({
        students: students.length,
        teachers: teachers.length,
        todayLessons: todayLessonsData.length,
        totalLessons: lessons.length,
      })

      setTodayLessons(todayLessonsData)

      // Mock chart data - attendance statistics
      setChartData([
        { day: "Mon", present: 15, absent: 3, noLesson: 2 },
        { day: "Tue", present: 18, absent: 2, noLesson: 1 },
        { day: "Wed", present: 16, absent: 4, noLesson: 2 },
        { day: "Thu", present: 19, absent: 1, noLesson: 1 },
        { day: "Fri", present: 12, absent: 5, noLesson: 3 },
        { day: "Sat", present: 17, absent: 2, noLesson: 2 },
      ])
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#10b981", "#ef4444", "#6b7280"]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome to Quran Teaching Company Management System</p>
        </div>
        <Button asChild className="w-fit bg-emerald-600 hover:bg-emerald-700">
          <Link href="/schedule">View Today's Schedule</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">Active enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teachers}</div>
            <p className="text-xs text-muted-foreground">Available teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Lessons</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayLessons}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">All time lessons</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Attendance statistics for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present" />
                <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                <Bar dataKey="noLesson" fill="#6b7280" name="No Lesson" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
            <CardDescription>Overall attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Present", value: 65 },
                    { name: "Absent", value: 20 },
                    { name: "No Lesson", value: 15 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Today's Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Lessons</CardTitle>
          <CardDescription>All lessons scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayLessons.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p className="text-lg font-medium">No lessons scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{lesson.lesson_date}</p>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.start_time}
                      </span>
                      <span>{lesson.duration} minutes</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                    {lesson.attendance}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-24 bg-transparent">
          <Link href="/students" className="flex flex-col gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <span>Manage Students</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 bg-transparent">
          <Link href="/teachers" className="flex flex-col gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Manage Teachers</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 bg-transparent">
          <Link href="/payments" className="flex flex-col gap-2">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <span>View Payments</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
