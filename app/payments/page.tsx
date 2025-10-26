"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  DollarSign,
  CreditCard,
  Edit2,
  Trash2,
  Download,
  RefreshCw,
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email: string
}

interface Teacher {
  id: string
  name: string
  email: string
}

interface Invoice {
  id: string
  student_id: string
  student_name: string
  student_email: string
  teacher_id: string
  teacher_name: string
  amount: number
  description: string
  due_date: string
  status: "pending" | "paid" | "overdue"
  payment_method?: string
  transaction_id?: string
  created_at: string
}

export default function PaymentsPage() {
  const { toast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid" | "overdue">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    student_id: "",
    teacher_id: "",
    amount: "",
    description: "Monthly Classes",
    due_date: "",
    payment_method: "paypal",
  })

  // Load initial data
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([loadInvoices(), loadStudents(), loadTeachers()])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      if (!response.ok) throw new Error("Failed to fetch invoices")
      const data = await response.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error fetching invoices:", error)
    }
  }

  const loadStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (!response.ok) throw new Error("Failed to fetch students")
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const loadTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      if (!response.ok) throw new Error("Failed to fetch teachers")
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.student_id || !formData.teacher_id || !formData.amount || !formData.due_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const student = students.find((s) => s.id === formData.student_id)
      const teacher = teachers.find((t) => t.id === formData.teacher_id)

      const payload = {
        student_id: formData.student_id,
        student_name: student?.name,
        student_email: student?.email,
        teacher_id: formData.teacher_id,
        teacher_name: teacher?.name,
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        due_date: formData.due_date,
        payment_method: formData.payment_method,
        status: "pending",
      }

      const method = editingInvoice ? "PUT" : "POST"
      const url = editingInvoice ? `/api/invoices/${editingInvoice.id}` : "/api/invoices"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save invoice")

      toast({
        title: "Success",
        description: editingInvoice ? "Invoice updated successfully!" : "Invoice created successfully!",
      })

      setIsDialogOpen(false)
      resetForm()
      await loadInvoices()
    } catch (error) {
      console.error("Error saving invoice:", error)
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!selectedInvoiceId) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/invoices/${selectedInvoiceId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete invoice")

      toast({
        title: "Success",
        description: "Invoice deleted successfully!",
      })

      setIsDeleteDialogOpen(false)
      setSelectedInvoiceId(null)
      await loadInvoices()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      student_id: invoice.student_id,
      teacher_id: invoice.teacher_id,
      amount: invoice.amount.toString(),
      description: invoice.description,
      due_date: invoice.due_date,
      payment_method: invoice.payment_method || "paypal",
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingInvoice(null)
    setFormData({
      student_id: "",
      teacher_id: "",
      amount: "",
      description: "Monthly Classes",
      due_date: "",
      payment_method: "paypal",
    })
  }

  const handleSendEmail = async (invoice: Invoice) => {
    try {
      const response = await fetch("/api/invoices/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_email: invoice.student_email,
          student_name: invoice.student_name,
          amount: invoice.amount,
          due_date: invoice.due_date,
          description: invoice.description,
          invoiceId: invoice.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to send email")

      toast({
        title: "Success",
        description: `Invoice sent to ${invoice.student_email}!`,
      })
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePayWithPayPal = (invoice: Invoice) => {
    // PayPal integration would go here
    toast({
      title: "Payment",
      description: `Redirecting to PayPal for payment of $${invoice.amount}...`,
    })
  }

  const handleExportCSV = () => {
    try {
      const filteredData = getFilteredInvoices()
      const csv = [
        ["Invoice ID", "Student", "Teacher", "Amount", "Due Date", "Status"],
        ...filteredData.map((inv) => [
          inv.id,
          inv.student_name,
          inv.teacher_name,
          `$${inv.amount}`,
          new Date(inv.due_date).toLocaleDateString(),
          inv.status,
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `invoices-${new Date().toISOString().split("T")[0]}.csv`)
      link.click()

      toast({
        title: "Success",
        description: "Invoices exported successfully!",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFilteredInvoices = () => {
    let filtered = invoices

    if (searchTerm) {
      filtered = filtered.filter(
        (inv) =>
          inv.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter)
    }

    return filtered
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-100 text-emerald-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices.filter((inv) => inv.status === "pending").reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0),
  }

  const filteredInvoices = getFilteredInvoices()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Payments Management</h1>
              <p className="text-slate-600">Manage student invoices and track payments</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={loadAllData} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddInvoice} className="space-y-4">
                  <div>
                    <Label htmlFor="student">Student *</Label>
                    <Select
                      value={formData.student_id}
                      onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="teacher">Teacher *</Label>
                    <Select
                      value={formData.teacher_id}
                      onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Monthly Classes"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="due_date">Due Date *</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select
                      value={formData.payment_method}
                      onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editingInvoice ? "Update Invoice" : "Create Invoice"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-medium text-sm">Total Revenue</p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-900">${stats.total.toFixed(2)}</p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-700/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 font-medium text-sm">Paid</p>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-900">${stats.paid.toFixed(2)}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-700/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-700 font-medium text-sm">Pending</p>
                  <p className="text-2xl md:text-3xl font-bold text-amber-900">${stats.pending.toFixed(2)}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-700/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 font-medium text-sm">Overdue</p>
                  <p className="text-2xl md:text-3xl font-bold text-red-900">${stats.overdue.toFixed(2)}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-700/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by student, teacher, or invoice ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportCSV} variant="outline" className="border-slate-200 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="font-semibold text-slate-700">Invoice ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Student</TableHead>
                    <TableHead className="font-semibold text-slate-700">Teacher</TableHead>
                    <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700">Due Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No invoices found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <TableCell className="font-mono text-sm text-slate-600">{invoice.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <Link
                            href={`/students/${invoice.student_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {invoice.student_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/teachers/${invoice.teacher_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {invoice.teacher_name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-semibold">${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSendEmail(invoice)}
                              className="text-green-600 hover:text-green-800"
                              title="Send invoice email"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePayWithPayPal(invoice)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Pay with PayPal"
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedInvoiceId(invoice.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this invoice? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
