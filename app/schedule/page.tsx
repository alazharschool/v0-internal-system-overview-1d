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
  day: string
  start_time: string
  duration: number
  status: "attended" | "absent" | "no_class" | "scheduled"
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function SchedulePage() {
  const [classes, setClasses] = useState<ScheduleClass[]>([])
  const [filteredClasses, setFilteredClasses] = useState<ScheduleClass[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [todayDay, setTodayDay] = useState<string>("")
  const { toast } = useToast()

  // تحديد اليوم الحالي
  useEffect(() => {
    const today = new Date()
    const dayName = DAYS_OF_WEEK[today.getDay()]
    setTodayDay(dayName)
    setSelectedDay(dayName)
  }, [])

  // تحميل الحصص من API
  const loadClasses = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/schedule/today")
      if (!res.ok) throw new Error("Failed to load schedule")
      const data: ScheduleClass[] = await res.json()
      setClasses(data)
      toast({ title: "Success", description: "Classes loaded successfully" })
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to load schedule", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  // فلترة حسب اليوم
  useEffect(() => {
    const filtered = classes.filter((c) => c.day === selectedDay)
    filtered.sort((a, b) => parseInt(a.start_time.replace(":", "")) - parseInt(b.start_time.replace(":", "")))
    setFilteredClasses(filtered)
  }, [classes, selectedDay])

  // تغيير حالة الحصة
  const handleStatusChange = useCallback(
    async (classId: string, newStatus: string) => {
      try {
        setClasses((prev) =>
          prev.map((c) => (c.id === classId ? { ...c, status: newStatus as ScheduleClass["status"] } : c)),
        )

        // تحديث في DB
        await fetch(`/api/classes/${classId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })

        toast({ title: "Success", description: `Status updated to ${newStatus}` })
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
      }
    },
    [toast],
  )

  const handleRefresh = useCallback(async () => {
    await loadClasses()
    toast({ title: "Refreshed", description: "Schedule updated" })
  }, [loadClasses, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge className="bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1" />Attended</Badge>
      case "absent":
        return <Badge className="bg-rose-100 text-rose-800"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>
      case "no_class":
        return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="w-3 h-3 mr-1" />No Class</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    const period = h >= 12 ? "PM" : "AM"
    const displayHour = h % 12 || 12
    return `${displayHour}:${m.toString().padStart(2, "0")} ${period}`
  }

  if (loading)
    return <div className="flex items-center justify-center min-h-screen">Loading schedule...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Class Schedule</h1>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          </div>
        </div>

        {/* Day Filter */}
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger>
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day) => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Classes Table */}
        {filteredClasses.length === 0 ? (
          <p>No classes for {selectedDay}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{c.student_name}</TableCell>
                  <TableCell>{c.teacher_name}</TableCell>
                  <TableCell>{formatTime(c.start_time)}</TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="attended">Attended</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="no_class">No Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
