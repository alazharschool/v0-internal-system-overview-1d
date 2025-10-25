"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Calendar, CheckCircle, XCircle, Clock, Edit, Home, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ScheduleTrialClassModal } from "@/components/modals/schedule-trial-class-modal"
import { useToast } from "@/hooks/use-toast"

interface TrialClass {
  id: string
  student_name: string
  student_email: string
  student_phone: string
  subject: string
  date: string
  time: string
  duration: number
  teacher_id?: string
  teacher?: { name: string }
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  outcome?: "pending" | "enrolled" | "declined"
  parent_name?: string
  parent_phone?: string
  notes?: string
}

// Custom Hook for Trial Classes Page Actions
function useTrialClassesPageActions() {
  const router = useRouter()
  const { toast } = useToast()
  const [trialClasses, setTrialClasses] = useState<TrialClass[]>([])
  const [filteredClasses, setFilteredClasses] = useState<TrialClass[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingClass, setEditingClass] = useState<TrialClass | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" })

  const loadTrialClasses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trial-classes")
      if (!response.ok) throw new Error("Failed to fetch trial classes")
      const data = await response.json()
      setTrialClasses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading trial classes:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trial classes. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTrialClasses()
  }, [loadTrialClasses])

  useEffect(() => {
    let filtered = trialClasses

    if (searchQuery) {
      filtered = filtered.filter(
        (tc) =>
          tc.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tc.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tc.subject.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tc) => tc.status === statusFilter)
    }

    setFilteredClasses(filtered)
  }, [trialClasses, searchQuery, statusFilter])

  const handleStatusChange = useCallback(
    async (id: string, newStatus: string) => {
      try {
        const response = await fetch(`/api/trial-classes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) throw new Error("Failed to update status")

        await loadTrialClasses()
        toast({
          title: "Success",
          description: "Trial class status updated",
        })
      } catch (error) {
        console.error("Error updating status:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update status. Please try again.",
        })
      }
    },
    [loadTrialClasses, toast],
  )

  const handleEdit = useCallback((trialClass: TrialClass) => {
    setEditingClass(trialClass)
    setIsEditModalOpen(true)
  }, [])

  const handleEditSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingClass) return

      try {
        const response = await fetch(`/api/trial-classes/${editingClass.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingClass),
        })

        if (!response.ok) throw new Error("Failed to update")

        await loadTrialClasses()
        setIsEditModalOpen(false)
        setEditingClass(null)
        toast({
          title: "Success",
          description: "Trial class updated successfully",
        })
      } catch (error) {
        console.error("Error updating trial class:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update trial class. Please try again.",
        })
      }
    },
    [editingClass, loadTrialClasses, toast],
  )

  const handleReschedule = useCallback((trialClass: TrialClass) => {
    setEditingClass(trialClass)
    setRescheduleData({ date: trialClass.date, time: trialClass.time })
    setIsRescheduleModalOpen(true)
  }, [])

  const handleRescheduleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingClass) return

      try {
        const response = await fetch(`/api/trial-classes/${editingClass.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: rescheduleData.date,
            time: rescheduleData.time,
            status: "scheduled",
          }),
        })

        if (!response.ok) throw new Error("Failed to reschedule")

        await loadTrialClasses()
        setIsRescheduleModalOpen(false)
        setEditingClass(null)
        toast({
          title: "Success",
          description: "Trial class rescheduled successfully",
        })
      } catch (error) {
        console.error("Error rescheduling:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reschedule trial class. Please try again.",
        })
      }
    },
    [editingClass, rescheduleData, loadTrialClasses, toast],
  )

  const handleRefresh = useCallback(async () => {
    try {
      await loadTrialClasses()
      toast({
        title: "Refreshed",
        description: "Trial classes updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh. Please try again.",
      })
    }
  }, [loadTrialClasses, toast])

  return {
    trialClasses,
    filteredClasses,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isEditModalOpen,
    setIsEditModalOpen,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    editingClass,
    setEditingClass,
    rescheduleData,
    setRescheduleData,
    handleStatusChange,
    handleEdit,
    handleEditSubmit,
    handleReschedule,
    handleRescheduleSubmit,
    handleRefresh,
    loadTrialClasses,
  }
}

export default function TrialClassesPage() {
  const actions = useTrialClassesPageActions()

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      scheduled: { variant: "default", label: "Scheduled", className: "bg-blue-500" },
      completed: { variant: "default", label: "Completed", className: "bg-green-500" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      no_show: { variant: "secondary", label: "No Show" },
    }
    const config = variants[status] || variants.scheduled
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const scheduledClasses = actions.trialClasses.filter((c) => c.status === "scheduled").length
  const completedClasses = actions.trialClasses.filter((c) => c.status === "completed").length
  const cancelledClasses = actions.trialClasses.filter((c) => c.status === "cancelled").length

  if (actions.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trial classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Trial Classes</h1>
          <p className="text-gray-500">Manage trial class sessions and convert to regular students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={actions.handleRefresh} variant="outline" className="border-slate-200 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <ScheduleTrialClassModal onSuccess={actions.loadTrialClasses} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trial Classes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actions.trialClasses.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{scheduledClasses}</div>
            <p className="text-xs text-muted-foreground">Upcoming sessions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedClasses}</div>
            <p className="text-xs text-muted-foreground">Finished sessions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{cancelledClasses}</div>
            <p className="text-xs text-muted-foreground">Cancelled sessions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trial Classes</CardTitle>
          <CardDescription>Manage and track trial class sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name, email, or subject..."
                value={actions.searchQuery}
                onChange={(e) => actions.setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actions.statusFilter} onValueChange={actions.setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No trial classes found
                    </TableCell>
                  </TableRow>
                ) : (
                  actions.filteredClasses.map((trialClass, index) => (
                    <TableRow key={trialClass.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <button className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors text-left">
                          {trialClass.student_name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{trialClass.student_email}</span>
                          <span className="text-gray-500">{trialClass.student_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trialClass.subject}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{trialClass.date}</span>
                          <span className="text-sm">{trialClass.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trialClass.duration} min</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={trialClass.status}
                          onValueChange={(value) => actions.handleStatusChange(trialClass.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => actions.handleEdit(trialClass)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => actions.handleReschedule(trialClass)}>
                            <Calendar className="h-3 w-3 mr-1" />
                            Reschedule
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

      {/* Edit Modal */}
      <Dialog open={actions.isEditModalOpen} onOpenChange={actions.setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={actions.handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Trial Class</DialogTitle>
              <DialogDescription>Update trial class information</DialogDescription>
            </DialogHeader>

            {actions.editingClass && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input
                      value={actions.editingClass.student_name}
                      onChange={(e) =>
                        actions.setEditingClass({
                          ...actions.editingClass,
                          student_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Student Email</Label>
                    <Input
                      type="email"
                      value={actions.editingClass.student_email}
                      onChange={(e) =>
                        actions.setEditingClass({
                          ...actions.editingClass,
                          student_email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Student Phone</Label>
                    <Input
                      value={actions.editingClass.student_phone}
                      onChange={(e) =>
                        actions.setEditingClass({
                          ...actions.editingClass,
                          student_phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      value={actions.editingClass.subject}
                      onValueChange={(value) =>
                        actions.setEditingClass({
                          ...actions.editingClass,
                          subject: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quran Memorization">Quran Memorization</SelectItem>
                        <SelectItem value="Arabic Language">Arabic Language</SelectItem>
                        <SelectItem value="Islamic Studies">Islamic Studies</SelectItem>
                        <SelectItem value="Tajweed">Tajweed</SelectItem>
                        <SelectItem value="Hadith Studies">Hadith Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={actions.editingClass.duration}
                      onChange={(e) =>
                        actions.setEditingClass({
                          ...actions.editingClass,
                          duration: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={actions.editingClass.notes || ""}
                    onChange={(e) =>
                      actions.setEditingClass({
                        ...actions.editingClass,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => actions.setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={actions.isRescheduleModalOpen} onOpenChange={actions.setIsRescheduleModalOpen}>
        <DialogContent>
          <form onSubmit={actions.handleRescheduleSubmit}>
            <DialogHeader>
              <DialogTitle>Reschedule Trial Class</DialogTitle>
              <DialogDescription>Select new date and time for {actions.editingClass?.student_name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Input
                  type="date"
                  value={actions.rescheduleData.date}
                  onChange={(e) => actions.setRescheduleData({ ...actions.rescheduleData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>New Time</Label>
                <Input
                  type="time"
                  value={actions.rescheduleData.time}
                  onChange={(e) => actions.setRescheduleData({ ...actions.rescheduleData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => actions.setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Reschedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
