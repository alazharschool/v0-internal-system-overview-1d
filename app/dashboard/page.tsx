"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, GraduationCap, DollarSign, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { formatCurrency, getStatusColor, getStatusText } from "@/lib/utils"

interface DashboardStats {
  students: {
    total: number
    active: number
  }
  teachers: {
    total: number
    active: number
  }
  payments: {
    monthlyTotal: number
    monthlyCount: number
  }
  classes: {
    today: number
    completedToday: number
  }
}

interface TodayClass {
  id: string
  date: string
  durationMin: number
  status: string
  student: {
    id: string
    name: string
  }
  teacher: {
    id: string
    user: {
      name: string
    }
  }
  attendance?: {
    status: string
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsResponse, classesResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/schedule/today"),
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        if (classesResponse.ok) {
          const classesData = await classesResponse.json()
          setTodayClasses(classesData)
        }
      } catch (error) {
        console.error("خطأ في جلب بيانات لوحة التحكم:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">لوحة التحكم</h2>
        <div className="flex items-center space-x-2">
          <Button>تحديث البيانات</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.students.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.students.active || 0} نشط من أصل {stats?.students.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المعلمين</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.teachers.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.teachers.active || 0} نشط من أصل {stats?.teachers.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إيرادات الشهر</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.payments.monthlyTotal || 0)}</div>
            <p className="text-xs text-muted-foreground">{stats?.payments.monthlyCount || 0} دفعة هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فصول اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.classes.today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.classes.completedToday || 0} مكتمل من أصل {stats?.classes.today || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>فصول اليوم</CardTitle>
            <CardDescription>جميع الفصول المجدولة لليوم الحالي</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">لا توجد فصول اليوم</h3>
                  <p className="mt-1 text-sm text-muted-foreground">لم يتم جدولة أي فصول لليوم الحالي</p>
                </div>
              ) : (
                todayClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/avatars/${classItem.student.id}.png`} />
                        <AvatarFallback>
                          {classItem.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{classItem.student.name}</p>
                        <p className="text-sm text-muted-foreground">مع {classItem.teacher.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(classItem.date).toLocaleTimeString("ar-SA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          - {classItem.durationMin} دقيقة
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(classItem.status)}>{getStatusText(classItem.status)}</Badge>
                      {classItem.attendance && (
                        <Badge className={getStatusColor(classItem.attendance.status)}>
                          {getStatusText(classItem.attendance.status)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>إحصائيات سريعة</CardTitle>
            <CardDescription>نظرة عامة على الأداء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">معدل الحضور</p>
                  <p className="text-sm text-muted-foreground">85% هذا الأسبوع</p>
                </div>
              </div>

              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">الفصول المكتملة</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.classes.completedToday || 0} من {stats?.classes.today || 0} اليوم
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-600" />
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">متوسط مدة الفصل</p>
                  <p className="text-sm text-muted-foreground">55 دقيقة</p>
                </div>
              </div>

              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">المدفوعات المعلقة</p>
                  <p className="text-sm text-muted-foreground">3 دفعات تحتاج متابعة</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
