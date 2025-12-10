"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Home, RefreshCw, Search, Download, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface AttendanceRecord {
  id: string
  student_id: string
  student_name: string
  date: string
  status: "present" | "absent" | "no_lesson"
  notes?: string
  created_at: string
}

interface AttendanceStats {
  total: number
  present: number
  absent: number
  no_lesson: number
  percentage: number
}

function useAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const { toast } = useToast()

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/attendance")
      if (!response.ok) throw new Error("Failed to load attendance")

      const data: AttendanceRecord[] = await response.json()
      setRecords(Array.isArray(data) ? data : [])

      toast({
        title: "Success",
        description: "Attendance loaded successfully",
      })
    } catch (error) {
      console.error("Error loading attendance:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  useEffect(() => {
    let filtered = records

    if (searchQuery) {
      filtered = filtered.filter((record) => record.student_name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedMonth) {
      filtered = filtered.filter((record) => record.date.startsWith(selectedMonth))
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((record) => record.status === selectedStatus)
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setFilteredRecords(filtered)
  }, [records, searchQuery, selectedMonth, selectedStatus])

  const stats: AttendanceStats = {
    total: filteredRecords.length,
    present: filteredRecords.filter((r) => r.status === "present").length,
    absent: filteredRecords.filter((r) => r.status === "absent").length,
    no_lesson: filteredRecords.filter((r) => r.status === "no_lesson").length,
    percentage:
      filteredRecords.length > 0
        ? Math.round((filteredRecords.filter((r) => r.status === "present").length / filteredRecords.length) * 100)
        : 0,
  }

  const handleExportCSV = () => {
    try {
      const headers = ["Student Name", "Date", "Status", "Notes"]
      const csvContent = [
        headers.join(","),
        ...filteredRecords.map((record) =>
          [record.student_name, record.date, record.status, record.notes || ""].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance_${selectedMonth}.csv`
      a.click()

      toast({
        title: "Success",
        description: "Attendance exported successfully",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Error",
        description: "Failed to export attendance",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = useCallback(async () => {
    try {
      await loadAttendance()
      toast({
        title: "Refreshed",
        description: "Attendance records updated",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh",
      })
    }
  }, [loadAttendance, toast])

  return {
    records,
    filteredRecords,
    loading,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    selectedStatus,
    setSelectedStatus,
    stats,
    handleExportCSV,
    handleRefresh,
  }
}

export default function AttendancePage() {
  const {
    filteredRecords,
    loading,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    selectedStatus,
    setSelectedStatus,
    stats,
    handleExportCSV,
    handleRefresh,
  } = useAttendancePage()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Present
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        )
      case "no_lesson":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            No Lesson
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMonthOptions = () => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
      months.push({ value, label })
    }
    return months
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading attendance records...</p>
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
              Attendance Tracking
            </h1>
            <p className="text-slate-600">Monitor student attendance and generate reports</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" className="border-slate-200 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-blue-700 font-medium text-sm">Total Records</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-emerald-700 font-medium text-sm">Present</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.present}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-rose-700 font-medium text-sm">Absent</p>
                <p className="text-3xl font-bold text-rose-900">{stats.absent}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-gray-700 font-medium text-sm">No Lesson</p>
                <p className="text-3xl font-bold text-gray-900">{stats.no_lesson}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-purple-700 font-medium text-sm">Attendance %</p>
                <p className="text-3xl font-bold text-purple-900">{stats.percentage}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getMonthOptions().map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="no_lesson">No Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by student name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-slate-200"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Attendance Table */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Records Found</h3>
                <p className="text-slate-600">No attendance records match your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-bold text-slate-700">#</TableHead>
                      <TableHead className="font-bold text-slate-700">Student Name</TableHead>
                      <TableHead className="font-bold text-slate-700">Date</TableHead>
                      <TableHead className="font-bold text-slate-700">Status</TableHead>
                      <TableHead className="font-bold text-slate-700">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <Link
                            href={`/students/${record.student_id}`}
                            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {record.student_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-700">{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-slate-600">{record.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
