"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Download,
  Home,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  FileText,
} from "lucide-react"
import Link from "next/link"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("overview")
  const [dateRange, setDateRange] = useState("month")

  // Sample data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 4500, students: 45 },
    { month: "Feb", revenue: 5200, students: 52 },
    { month: "Mar", revenue: 4800, students: 48 },
    { month: "Apr", revenue: 6100, students: 61 },
    { month: "May", revenue: 5800, students: 58 },
    { month: "Jun", revenue: 6500, students: 65 },
  ]

  const subjectDistribution = [
    { name: "Quran Memorization", value: 35, students: 28 },
    { name: "Arabic Language", value: 25, students: 20 },
    { name: "Islamic Studies", value: 20, students: 16 },
    { name: "Hadith Studies", value: 12, students: 10 },
    { name: "Tajweed", value: 8, students: 6 },
  ]

  const classCompletion = [
    { week: "Week 1", completed: 85, cancelled: 15 },
    { week: "Week 2", completed: 92, cancelled: 8 },
    { week: "Week 3", completed: 88, cancelled: 12 },
    { week: "Week 4", completed: 95, cancelled: 5 },
  ]

  const topPerformers = [
    { name: "Dr. Mohamed Abdelrahman", subject: "Quran Memorization", classes: 45, rating: 4.9 },
    { name: "Prof. Aisha Ahmed", subject: "Arabic Language", classes: 38, rating: 4.8 },
    { name: "Dr. Ahmed Hassan", subject: "Islamic Studies", classes: 32, rating: 4.7 },
    { name: "Prof. Fatima Salem", subject: "Hadith Studies", classes: 28, rating: 4.8 },
    { name: "Sheikh Khaled Mohamed", subject: "Tajweed", classes: 25, rating: 4.6 },
  ]

  const getStats = () => {
    return {
      totalRevenue: 32900,
      totalStudents: 289,
      totalClasses: 1456,
      completionRate: 92,
    }
  }

  const stats = getStats()

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
                Reports & Analytics
              </h1>
              <p className="text-slate-600 text-lg">Comprehensive insights and performance analytics.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48 border-slate-200">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 border-slate-200">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-blue-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-emerald-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+8% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-purple-700 font-medium text-sm">Total Classes</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalClasses.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-purple-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-orange-700 font-medium text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-orange-700">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+3% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-blue-600" />
                Monthly Revenue & Students
              </CardTitle>
              <CardDescription>Revenue and student enrollment trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" />
                  <Line yAxisId="right" type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-600" />
                Subject Distribution
              </CardTitle>
              <CardDescription>Student enrollment by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Class Completion Chart */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Weekly Class Completion Rate
            </CardTitle>
            <CardDescription>Completed vs cancelled classes by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classCompletion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" stackId="a" fill="#10B981" />
                <Bar dataKey="cancelled" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Top Performing Teachers
            </CardTitle>
            <CardDescription>Teachers ranked by classes taught and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">#</TableHead>
                    <TableHead className="font-semibold text-slate-700">Teacher</TableHead>
                    <TableHead className="font-semibold text-slate-700">Subject</TableHead>
                    <TableHead className="font-semibold text-slate-700">Classes Taught</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rating</TableHead>
                    <TableHead className="font-semibold text-slate-700">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformers.map((teacher, index) => (
                    <TableRow key={teacher.name} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{teacher.name}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{teacher.subject}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-900">{teacher.classes}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-900">{teacher.rating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= Math.floor(teacher.rating) ? "text-yellow-400 fill-current" : "text-slate-300"
                                }`}
                              >
                                ⭐
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            teacher.rating >= 4.8
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : teacher.rating >= 4.5
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                          }
                        >
                          {teacher.rating >= 4.8 ? "Excellent" : teacher.rating >= 4.5 ? "Very Good" : "Good"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
