"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Search, Calendar, CheckCircle, XCircle, Clock, Edit, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { trialClassesAPI, teachersAPI, type TrialClass, type Teacher } from "@/lib/database"
import { formatEgyptTime, getDayName } from "@/utils/time-format"
import { useToast } from "@/hooks/use-toast"
import { ScheduleTrialClassModal } from "@/components/modals/schedule-trial-class-modal"

export default function TrialClassesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [trialClasses, setTrialClasses] = useState<TrialClass[]>([])
  const [filteredClasses, setFilteredClasses] = useState<TrialClass[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingClass, setEditingClass] = useState<TrialClass | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterClasses()
  }, [trialClasses, searchQuery, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [classesData, teachersData] = await Promise.all([trialClassesAPI.getAll(), teachersAPI.getAll()])
      setTrialClasses(classesData)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load trial classes",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterClasses = () => {
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
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await trialClassesAPI.update(id, { status: newStatus as any })
      await loadData()
      toast({
        title: "Success",
        description: "Trial class status updated",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      })
    }
  }

  const handleEdit = (trialClass: TrialClass) => {
    setEditingClass(trialClass)
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass) return

    try {
      await trialClassesAPI.update(editingClass.id, editingClass)
      await loadData()
      setIsEditModalOpen(false)
      setEditingClass(null)
      toast({
        title: "Success",
        description: "Trial class updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update trial class",
      })
    }
  }

  const handleReschedule = (trialClass: TrialClass) => {
    setEditingClass(trialClass)
    setRescheduleData({ date: trialClass.date, time: trialClass.time })
    setIsRescheduleModalOpen(true)
  }

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClass) return

    try {
      await trialClassesAPI.update(editingClass.id, {
        date: rescheduleData.date,
        time: rescheduleData.time,
        status: "scheduled",
      })
      await loadData()
      setIsRescheduleModalOpen(false)
      setEditingClass(null)
      toast({
        title: "Success",
        description: "Trial class rescheduled successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reschedule trial class",
      })
    }
  }

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

  const scheduledClasses = trialClasses.filter((c) => c.status === "scheduled").length
  const completedClasses = trialClasses.filter((c) => c.status === "completed").length
  const cancelledClasses = trialClasses.filter((c) => c.status === "cancelled").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trial classes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="ltr">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trial Classes</h1>
          <p className="text-gray-500">Manage trial class sessions and convert to regular students</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <ScheduleTrialClassModal onSuccess={loadData} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trial Classes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialClasses.length}</div>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                      No trial classes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((trialClass, index) => (
                    <TableRow key={trialClass.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <button
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors text-left"
                          onClick={() => {
                            toast({
                              title: "Student Profile",
                              description: `This is a trial student. Create a student account to view their profile.`,
                            })
                          }}
                        >
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
                        {trialClass.teacher ? (
                          <Link
                            href={`/teachers/${trialClass.teacher_id}`}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition-colors"
                          >
                            {trialClass.teacher.name}
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trialClass.subject}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{trialClass.date}</span>
                          <span className="text-xs text-gray-500">{getDayName(new Date(trialClass.date))}</span>
                          <span className="text-sm">{formatEgyptTime(trialClass.time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trialClass.duration} min</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={trialClass.status}
                          onValueChange={(value) => handleStatusChange(trialClass.id, value)}
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
                      <TableCell>
                        {trialClass.outcome && (
                          <Badge
                            variant={
                              trialClass.outcome === "enrolled"
                                ? "default"
                                : trialClass.outcome === "declined"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={trialClass.outcome === "enrolled" ? "bg-green-500" : ""}
                          >
                            {trialClass.outcome}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(trialClass)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReschedule(trialClass)}>
                            <Clock className="h-3 w-3 mr-1" />
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Trial Class</DialogTitle>
              <DialogDescription>Update trial class information</DialogDescription>
            </DialogHeader>

            {editingClass && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input
                      value={editingClass.student_name}
                      onChange={(e) => setEditingClass({ ...editingClass, student_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Student Email</Label>
                    <Input
                      type="email"
                      value={editingClass.student_email}
                      onChange={(e) => setEditingClass({ ...editingClass, student_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Student Phone</Label>
                    <Input
                      value={editingClass.student_phone}
                      onChange={(e) => setEditingClass({ ...editingClass, student_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent Name</Label>
                    <Input
                      value={editingClass.parent_name || ""}
                      onChange={(e) => setEditingClass({ ...editingClass, parent_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Parent Phone</Label>
                    <Input
                      value={editingClass.parent_phone || ""}
                      onChange={(e) => setEditingClass({ ...editingClass, parent_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                      value={editingClass.subject}
                      onValueChange={(value) => setEditingClass({ ...editingClass, subject: value })}
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
                      value={editingClass.duration}
                      onChange={(e) => setEditingClass({ ...editingClass, duration: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Outcome</Label>
                    <Select
                      value={editingClass.outcome || "pending"}
                      onValueChange={(value: any) => setEditingClass({ ...editingClass, outcome: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editingClass.notes || ""}
                    onChange={(e) => setEditingClass({ ...editingClass, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent>
          <form onSubmit={handleRescheduleSubmit}>
            <DialogHeader>
              <DialogTitle>Reschedule Trial Class</DialogTitle>
              <DialogDescription>Select new date and time for {editingClass?.student_name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Date</Label>
                <Input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>New Time</Label>
                <Input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>
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
