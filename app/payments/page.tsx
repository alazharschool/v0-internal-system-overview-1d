"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Download,
  Calendar,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  id: string
  student_id: string
  student_name: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  method?: string
  invoiceNumber: string
  description: string
}

// Custom Hook for Payments Page Actions
function usePaymentsPageActions() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all")
  const { toast } = useToast()

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockPayments: Payment[] = [
        {
          id: "1",
          student_id: "1",
          student_name: "أحمد محمد",
          amount: 300,
          dueDate: "2024-01-15",
          paidDate: "2024-01-14",
          status: "paid",
          method: "تحويل بنكي",
          invoiceNumber: "INV-2024-001",
          description: "الحصص الشهرية",
        },
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error("Error loading payments:", error)
      toast({
        title: "خطأ",
        description: "فشل تحميل المدفوعات. حاول مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [payments, searchTerm, statusFilter])

  const handleExportReport = useCallback(() => {
    try {
      const csv = [
        ["الفاتورة", "الطالب", "المبلغ", "تاريخ الاستحقاق", "الحالة"],
        ...filteredPayments.map((p) => [p.invoiceNumber, p.student_name, `$${p.amount}`, p.dueDate, p.status]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
      a.click()

      toast({
        title: "نجاح",
        description: "تم تصدير التقرير بنجاح! ✅",
      })
    } catch (error) {
      console.error("Error exporting report:", error)
      toast({
        title: "خطأ",
        description: "فشل تصدير التقرير. حاول مرة أخرى.",
        variant: "destructive",
      })
    }
  }, [filteredPayments, toast])

  const handleAddPayment = useCallback(() => {
    toast({
      title: "إضافة مدفوعة",
      description: "هذه الميزة قريباً",
    })
  }, [toast])

  const handleRefresh = useCallback(async () => {
    try {
      await loadPayments()
      toast({
        title: "تم التحديث",
        description: "تم تحديث المدفوعات بنجاح! ✅",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل التحديث. حاول مرة أخرى.",
      })
    }
  }, [loadPayments, toast])

  return {
    payments,
    filteredPayments,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleExportReport,
    handleAddPayment,
    handleRefresh,
  }
}

export default function PaymentsPage() {
  const actions = usePaymentsPageActions()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">مدفوع</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">قيد الانتظار</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">متأخر</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: actions.payments.reduce((sum, p) => sum + p.amount, 0),
    paid: actions.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pending: actions.payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    overdue: actions.payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0),
  }

  if (actions.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المدفوعات...</p>
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
                لوحة التحكم
              </Link>
            </Button>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                إدارة المدفوعات
              </h1>
              <p className="text-slate-600 text-lg">متابعة وإدارة جميع مدفوعات الطلاب</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={actions.handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              تحديث
            </Button>
            <Button onClick={actions.handleAddPayment} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              إضافة مدفوعة
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-blue-900">${stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">مدفوع</p>
                  <p className="text-3xl font-bold text-emerald-900">${stats.paid}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-amber-700 font-medium text-sm">قيد الانتظار</p>
                  <p className="text-3xl font-bold text-amber-900">${stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-red-700 font-medium text-sm">متأخر</p>
                  <p className="text-3xl font-bold text-red-900">${stats.overdue}</p>
                </div>
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في المدفوعات..."
                    value={actions.searchTerm}
                    onChange={(e) => actions.setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={actions.statusFilter} onValueChange={(value) => actions.setStatusFilter(value as any)}>
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="paid">مدفوع</TabsTrigger>
                    <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
                    <TabsTrigger value="overdue">متأخر</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  onClick={actions.handleExportReport}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Payments Table */}
        <Card className="shadow-sm border-slate-200">
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">#</TableHead>
                    <TableHead className="font-semibold text-slate-700">الطالب</TableHead>
                    <TableHead className="font-semibold text-slate-700">الفاتورة</TableHead>
                    <TableHead className="font-semibold text-slate-700">المبلغ</TableHead>
                    <TableHead className="font-semibold text-slate-700">تاريخ الاستحقاق</TableHead>
                    <TableHead className="font-semibold text-slate-700">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">لم يتم العثور على مدفوعات</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    actions.filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {payment.student_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <Link
                              href={`/students/${payment.student_id}`}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                              {payment.student_name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-slate-600">{payment.invoiceNumber}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">${payment.amount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
