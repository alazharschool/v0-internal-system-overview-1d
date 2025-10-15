"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Calendar,
  Users,
  BookOpen,
  CreditCard,
  Award,
  UserPlus,
  Home,
  ActivityIcon,
  Clock,
  CheckCircle,
  Info,
} from "lucide-react"
import { dashboardAPI, type Activity } from "@/lib/database"
import { formatRelativeTime } from "@/utils/time-format"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, searchTerm, typeFilter])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const data = await dashboardAPI.getRecentActivities(50)
      setActivities(data)
    } catch (error) {
      console.error("Error loading activities:", error)
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((activity) => activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((activity) => activity.type === typeFilter)
    }

    setFilteredActivities(filtered)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student_added":
        return <UserPlus className="w-4 h-4 text-blue-600" />
      case "teacher_added":
        return <Users className="w-4 h-4 text-emerald-600" />
      case "class_scheduled":
        return <Calendar className="w-4 h-4 text-purple-600" />
      case "class_completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "payment_received":
        return <CreditCard className="w-4 h-4 text-green-600" />
      case "certificate_issued":
        return <Award className="w-4 w-4 text-yellow-600" />
      case "trial_scheduled":
        return <Clock className="w-4 h-4 text-orange-600" />
      case "student_progress":
        return <BookOpen className="w-4 h-4 text-indigo-600" />
      default:
        return <Info className="w-4 h-4 text-slate-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "student_added":
        return "bg-blue-50 border-blue-200"
      case "teacher_added":
        return "bg-emerald-50 border-emerald-200"
      case "class_scheduled":
        return "bg-purple-50 border-purple-200"
      case "class_completed":
        return "bg-emerald-50 border-emerald-200"
      case "payment_received":
        return "bg-green-50 border-green-200"
      case "certificate_issued":
        return "bg-yellow-50 border-yellow-200"
      case "trial_scheduled":
        return "bg-orange-50 border-orange-200"
      case "student_progress":
        return "bg-indigo-50 border-indigo-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "student_added":
        return "Student Added"
      case "teacher_added":
        return "Teacher Added"
      case "class_scheduled":
        return "Class Scheduled"
      case "class_completed":
        return "Class Completed"
      case "payment_received":
        return "Payment Received"
      case "certificate_issued":
        return "Certificate Issued"
      case "trial_scheduled":
        return "Trial Scheduled"
      case "student_progress":
        return "Student Progress"
      default:
        return "Activity"
    }
  }

  const getStats = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayActivities = activities.filter((a) => a.created_at.startsWith(today))

    const typeStats = activities.reduce(
      (acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: activities.length,
      today: todayActivities.length,
      mostActive: Object.entries(typeStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "none",
      typeStats,
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded w-64"></div>
              <div className="h-4 bg-slate-200 rounded w-96"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
              ))}
            </div>

            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
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
                System Activity
              </h1>
              <p className="text-slate-600 text-lg">Track all system activities and user interactions.</p>
            </div>
          </div>
          <Button variant="outline" onClick={loadActivities} className="border-slate-200 bg-transparent">
            <ActivityIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Activities</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <ActivityIcon className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Today's Activities</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.today}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-purple-700 font-medium text-sm">Most Active</p>
                  <p className="text-lg font-bold text-purple-900">{getTypeLabel(stats.mostActive)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  {getActivityIcon(stats.mostActive)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="student_added">Student Added</SelectItem>
                    <SelectItem value="teacher_added">Teacher Added</SelectItem>
                    <SelectItem value="class_scheduled">Class Scheduled</SelectItem>
                    <SelectItem value="class_completed">Class Completed</SelectItem>
                    <SelectItem value="payment_received">Payment Received</SelectItem>
                    <SelectItem value="certificate_issued">Certificate Issued</SelectItem>
                    <SelectItem value="trial_scheduled">Trial Scheduled</SelectItem>
                    <SelectItem value="student_progress">Student Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Activity Feed */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-indigo-600" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities and user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <ActivityIcon className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Activities Found</h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || typeFilter !== "all"
                    ? "No activities match your search criteria."
                    : "No activities have been recorded yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors hover:shadow-sm ${getActivityColor(
                      activity.type,
                    )}`}
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(activity.type)}
                          </Badge>
                          <span className="text-xs text-slate-500">#{index + 1}</span>
                        </div>
                        <span className="text-sm text-slate-500">{formatRelativeTime(activity.created_at)}</span>
                      </div>
                      <p className="text-slate-900 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
