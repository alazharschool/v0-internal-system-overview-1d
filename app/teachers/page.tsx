"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Search, MoreVertical, Mail, Phone, DollarSign, Calendar, Home, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { AddTeacherModal } from "@/components/modals/add-teacher-modal"

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  hourly_rate: number
  status: "active" | "inactive"
  join_date: string
}

// Custom Hook for Teacher Page Actions
function useTeacherPageActions() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/teachers")
      if (!response.ok) throw new Error("Failed to load teachers")
      const data = await response.json()
      setTeachers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading teachers:", error)
      toast({
        title: "Error",
        description: "Failed to load teachers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  useEffect(() => {
    let filtered = teachers

    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter)
    }

    setFilteredTeachers(filtered)
  }, [teachers, searchQuery, statusFilter])

  const handleDeleteTeacher = useCallback(
    async (id: string, name: string) => {
      if (!window.confirm(`Are you sure you want to delete ${name}?`)) return

      try {
        const response = await fetch(`/api/teachers/${id}`, { method: "DELETE" })
        if (!response.ok) throw new Error("Failed to delete teacher")

        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        })
        await loadTeachers()
      } catch (error) {
        console.error("Error deleting teacher:", error)
        toast({
          title: "Error",
          description: "Failed to delete teacher. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast, loadTeachers],
  )

  const handleRefresh = useCallback(async () => {
    try {
      await loadTeachers()
      toast({
        title: "Refreshed",
        description: "Teacher list updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh. Please try again.",
      })
    }
  }, [loadTeachers, toast])

  return {
    teachers,
    filteredTeachers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    loading,
    handleDeleteTeacher,
    handleRefresh,
    loadTeachers,
  }
}

export default function TeachersPage() {
  const actions = useTeacherPageActions()

  const stats = {
    total: actions.teachers.length,
    active: actions.teachers.filter((t) => t.status === "active").length,
    inactive: actions.teachers.filter((t) => t.status === "inactive").length,
  }

  if (actions.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teachers...</p>
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
                Teachers Management
              </h1>
              <p className="text-slate-600 text-lg">Manage your teaching staff</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={actions.handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => actions.setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-blue-700 font-medium text-sm">Total Teachers</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-emerald-700 font-medium text-sm">Active</p>
                  <p className="text-3xl font-bold text-emerald-900">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-gray-700 font-medium text-sm">Inactive</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search teachers..."
                    value={actions.searchQuery}
                    onChange={(e) => actions.setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-200"
                  />
                </div>
              </div>
              <select
                value={actions.statusFilter}
                onChange={(e) => actions.setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-slate-200 rounded-md bg-white text-slate-700 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Teachers Grid */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>All Teachers</CardTitle>
            <CardDescription>Showing {actions.filteredTeachers.length} teachers</CardDescription>
          </CardHeader>
          <CardContent>
            {actions.filteredTeachers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No teachers found</p>
                <Button onClick={() => actions.setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Teacher
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.filteredTeachers.map((teacher) => (
                  <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                              {teacher.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/teachers/${teacher.id}`}
                              className="font-semibold text-gray-900 hover:text-emerald-600 hover:underline transition-colors cursor-pointer"
                            >
                              {teacher.name}
                            </Link>
                            <p className="text-sm text-gray-600">{teacher.subject}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => actions.handleDeleteTeacher(teacher.id, teacher.name)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {teacher.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />${teacher.hourly_rate}/hour
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {new Date(teacher.join_date).toLocaleDateString()}
                        </div>
                      </div>

                      <Badge
                        variant={teacher.status === "active" ? "default" : "secondary"}
                        className={teacher.status === "active" ? "bg-green-600" : "bg-gray-600"}
                      >
                        {teacher.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        open={actions.isAddModalOpen}
        onOpenChange={actions.setIsAddModalOpen}
        onSuccess={actions.loadTeachers}
      />
    </div>
  )
}
