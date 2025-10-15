"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"

interface Payment {
  id: string
  studentName: string
  studentId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  method?: string
  invoiceNumber: string
  description: string
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all")
  const [payments] = useState<Payment[]>([
    {
      id: "1",
      studentName: "Ahmed Mohamed Ali",
      studentId: "1",
      amount: 300,
      dueDate: "2024-01-15",
      paidDate: "2024-01-14",
      status: "paid",
      method: "Bank Transfer",
      invoiceNumber: "INV-2024-001",
      description: "Monthly Quran Memorization Classes",
    },
    {
      id: "2",
      studentName: "Fatima Abdullah",
      studentId: "2",
      amount: 250,
      dueDate: "2024-01-20",
      status: "pending",
      invoiceNumber: "INV-2024-002",
      description: "Monthly Arabic Language Classes",
    },
    {
      id: "3",
      studentName: "Omar Hassan",
      studentId: "3",
      amount: 280,
      dueDate: "2024-01-10",
      status: "overdue",
      invoiceNumber: "INV-2024-003",
      description: "Monthly Islamic Studies Classes",
    },
    {
      id: "4",
      studentName: "Khadija Salem",
      studentId: "4",
      amount: 320,
      dueDate: "2024-01-25",
      paidDate: "2024-01-24",
      status: "paid",
      method: "Credit Card",
      invoiceNumber: "INV-2024-004",
      description: "Monthly Hadith Studies Classes",
    },
    {
      id: "5",
      studentName: "Youssef Ibrahim",
      studentId: "5",
      amount: 200,
      dueDate: "2024-01-18",
      status: "pending",
      invoiceNumber: "INV-2024-005",
      description: "Monthly Tajweed Classes",
    },
  ])

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const paid = payments.filter((p) => p.status === "paid").reduce((sum, payment) => sum + payment.amount, 0)
    const pending = payments.filter((p) => p.status === "pending").reduce((sum, payment) => sum + payment.amount, 0)
    const overdue = payments.filter((p) => p.status === "overdue").reduce((sum, payment) => sum + payment.amount, 0)

    return { total, paid, pending, overdue }
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
                Payments Management
              </h1>
              <p className="text-slate-600 text-lg">Track and manage all student payments and invoices.</p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-900">${stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Paid</p>
                  <p className="text-3xl font-bold text-emerald-900">${stats.paid}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-amber-700 font-medium text-sm">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">${stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-red-700 font-medium text-sm">Overdue</p>
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
                    placeholder="Search payments by student, invoice, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm" className="border-slate-200 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">#</TableHead>
                    <TableHead className="font-semibold text-slate-700">Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">Invoice</TableHead>
                    <TableHead className="font-semibold text-slate-700">Description</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4">
                          {searchTerm || statusFilter !== "all"
                            ? "No payments match your filters"
                            : "No payments found"}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Payment
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8 ring-2 ring-slate-200">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${payment.studentName}`}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-semibold">
                                {getInitials(payment.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <Link
                              href={`/students/${payment.studentId}`}
                              className="font-medium text-slate-900 hover:text-emerald-600 hover:underline transition-colors"
                            >
                              {payment.studentName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-slate-600">{payment.invoiceNumber}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{payment.description}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-slate-900">${payment.amount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <span className="text-slate-600">{payment.method || "-"}</span>
                        </TableCell>
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
