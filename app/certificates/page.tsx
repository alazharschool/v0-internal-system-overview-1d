"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Award, Download, Eye, Calendar, CheckCircle, Clock, Home, GraduationCap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Certificate {
  id: string
  studentName: string
  studentId: string
  courseName: string
  subject: string
  issueDate: string
  completionDate: string
  grade: string
  certificateNumber: string
  status: "issued" | "pending" | "revoked"
  teacherName: string
  totalHours: number
}

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "issued" | "pending" | "revoked">("all")
  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      studentName: "Ahmed Mohamed Ali",
      studentId: "1",
      courseName: "Advanced Quran Memorization",
      subject: "Quran Memorization",
      issueDate: "2024-01-15",
      completionDate: "2024-01-10",
      grade: "Excellent",
      certificateNumber: "CERT-2024-001",
      status: "issued",
      teacherName: "Dr. Mohamed Abdelrahman",
      totalHours: 120,
    },
    {
      id: "2",
      studentName: "Fatima Abdullah",
      studentId: "2",
      courseName: "Arabic Grammar Fundamentals",
      subject: "Arabic Language",
      issueDate: "2024-01-20",
      completionDate: "2024-01-18",
      grade: "Very Good",
      certificateNumber: "CERT-2024-002",
      status: "issued",
      teacherName: "Prof. Aisha Ahmed",
      totalHours: 80,
    },
    {
      id: "3",
      studentName: "Omar Hassan",
      studentId: "3",
      courseName: "Islamic Studies Foundation",
      subject: "Islamic Studies",
      issueDate: "",
      completionDate: "2024-01-22",
      grade: "Good",
      certificateNumber: "CERT-2024-003",
      status: "pending",
      teacherName: "Dr. Ahmed Hassan",
      totalHours: 100,
    },
    {
      id: "4",
      studentName: "Khadija Salem",
      studentId: "4",
      courseName: "Hadith Sciences",
      subject: "Hadith Studies",
      issueDate: "2024-01-12",
      completionDate: "2024-01-08",
      grade: "Excellent",
      certificateNumber: "CERT-2024-004",
      status: "issued",
      teacherName: "Prof. Fatima Salem",
      totalHours: 150,
    },
    {
      id: "5",
      studentName: "Youssef Ibrahim",
      studentId: "5",
      courseName: "Tajweed Mastery",
      subject: "Tajweed",
      issueDate: "",
      completionDate: "2024-01-25",
      grade: "Very Good",
      certificateNumber: "CERT-2024-005",
      status: "pending",
      teacherName: "Sheikh Khaled Mohamed",
      totalHours: 90,
    },
  ])

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch =
      certificate.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || certificate.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Certificate["status"]) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Issued</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
      case "revoked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Revoked</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
      case "Very Good":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Very Good</Badge>
      case "Good":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Good</Badge>
      default:
        return <Badge variant="outline">{grade}</Badge>
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
    const total = certificates.length
    const issued = certificates.filter((c) => c.status === "issued").length
    const pending = certificates.filter((c) => c.status === "pending").length
    const thisMonth = certificates.filter((c) => {
      if (!c.issueDate) return false
      const issueDate = new Date(c.issueDate)
      const now = new Date()
      return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear()
    }).length

    return { total, issued, pending, thisMonth }
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
                Certificates Management
              </h1>
              <p className="text-slate-600 text-lg">Issue and manage student certificates and achievements.</p>
            </div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Certificates</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Issued</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.issued}</p>
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
                  <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-purple-700 font-medium text-sm">This Month</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.thisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-700" />
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
                    placeholder="Search certificates by student, course, or certificate number..."
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
                    <TabsTrigger value="issued">Issued</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="revoked">Revoked</TabsTrigger>
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
                    <TableHead className="font-semibold text-slate-700">Course</TableHead>
                    <TableHead className="font-semibold text-slate-700">Certificate #</TableHead>
                    <TableHead className="font-semibold text-slate-700">Grade</TableHead>
                    <TableHead className="font-semibold text-slate-700">Hours</TableHead>
                    <TableHead className="font-semibold text-slate-700">Issue Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4">
                          {searchTerm || statusFilter !== "all"
                            ? "No certificates match your filters"
                            : "No certificates found"}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Issue First Certificate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCertificates.map((certificate, index) => (
                      <TableRow key={certificate.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-medium text-slate-600">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8 ring-2 ring-slate-200">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${certificate.studentName}`}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-xs font-semibold">
                                {getInitials(certificate.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <Link
                              href={`/students/${certificate.studentId}`}
                              className="font-medium text-slate-900 hover:text-emerald-600 hover:underline transition-colors"
                            >
                              {certificate.studentName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-slate-900">{certificate.courseName}</p>
                            <p className="text-sm text-slate-600">{certificate.subject}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm text-slate-600">{certificate.certificateNumber}</span>
                        </TableCell>
                        <TableCell>{getGradeBadge(certificate.grade)}</TableCell>
                        <TableCell>
                          <span className="text-slate-600">{certificate.totalHours}h</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "Pending"}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(certificate.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Certificate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              {certificate.status === "pending" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Issue Certificate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
