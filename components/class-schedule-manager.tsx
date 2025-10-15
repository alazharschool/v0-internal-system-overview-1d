"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, BookOpen, Edit, Trash2 } from "lucide-react"
import { ScheduleClassModal } from "./modals/schedule-class-modal"
import { toast } from "@/components/ui/use-toast"

interface ClassSession {
  id: string
  student: string
  teacher: string
  subject: string
  date: string
  time: string
  duration: number
  status: "scheduled" | "completed" | "cancelled"
  type: "regular" | "makeup" | "assessment" | "review"
}

export function ClassScheduleManager() {
  const [classes, setClasses] = useState<ClassSession[]>([
    {
      id: "1",
      student: "Ahmed Hassan",
      teacher: "Sarah Johnson",
      subject: "Quran Memorization",
      date: "2024-01-15",
      time: "10:00",
      duration: 60,
      status: "scheduled",
      type: "regular",
    },
    {
      id: "2",
      student: "Sara Ahmed",
      teacher: "Michael Brown",
      subject: "Tajweed",
      date: "2024-01-15",
      time: "14:00",
      duration: 45,
      status: "scheduled",
      type: "regular",
    },
    {
      id: "3",
      student: "Omar Youssef",
      teacher: "Emily Davis",
      subject: "Arabic Language",
      date: "2024-01-16",
      time: "09:00",
      duration: 60,
      status: "completed",
      type: "assessment",
    },
    {
      id: "4",
      student: "Fatima Khalid",
      teacher: "Amanda Lee",
      subject: "Islamic Studies",
      date: "2024-01-16",
      time: "16:00",
      duration: 90,
      status: "scheduled",
      type: "review",
    },
  ])

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId))
    toast({
      title: "Class Deleted",
      description: "The class has been removed from the schedule.",
    })
  }

  const handleStatusChange = (classId: string, newStatus: ClassSession["status"]) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, status: newStatus } : c)))
    toast({
      title: "Status Updated",
      description: `Class status changed to ${newStatus}.`,
    })
  }

  const getStatusColor = (status: ClassSession["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: ClassSession["type"]) => {
    switch (type) {
      case "regular":
        return "bg-gray-100 text-gray-800"
      case "makeup":
        return "bg-yellow-100 text-yellow-800"
      case "assessment":
        return "bg-purple-100 text-purple-800"
      case "review":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Class Schedule Manager</h2>
          <p className="text-muted-foreground">Manage and organize class sessions</p>
        </div>
        <ScheduleClassModal />
      </div>

      <div className="grid gap-4">
        {classes.map((classSession) => (
          <Card key={classSession.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{classSession.subject}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Student: {classSession.student}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      Teacher: {classSession.teacher}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(classSession.status)}>{classSession.status}</Badge>
                  <Badge className={getTypeColor(classSession.type)}>{classSession.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(classSession.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {classSession.time} ({classSession.duration} min)
                  </span>
                </div>
                <div className="flex gap-2">
                  {classSession.status === "scheduled" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(classSession.id, "completed")}
                      >
                        Mark Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(classSession.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteClass(classSession.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Classes Scheduled</h3>
            <p className="text-muted-foreground mb-4">Start by scheduling your first class session.</p>
            <ScheduleClassModal />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
