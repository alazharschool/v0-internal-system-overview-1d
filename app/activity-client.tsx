"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ActivityClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activityType, setActivityType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Activities refreshed",
        description: "The activity log has been updated with the latest data.",
      })
    }, 1000)
  }

  const handleFilter = () => {
    toast({
      title: "Filters applied",
      description: "The activity log has been filtered based on your criteria.",
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleActivityTypeChange = (value: string) => {
    setActivityType(value)
  }

  const handleViewDetails = (activityName: string) => {
    toast({
      title: "Viewing activity details",
      description: `Details for "${activityName}" are being loaded.`,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search activities..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Select defaultValue={activityType} onValueChange={handleActivityTypeChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="class">Class Activities</SelectItem>
            <SelectItem value="payment">Payment Activities</SelectItem>
            <SelectItem value="certificate">Certificate Activities</SelectItem>
            <SelectItem value="user">User Activities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="admin">Administrative</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All system activities in chronological order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Today's Activities */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Today - April 11, 2023</h3>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                    iconBg="bg-primary/10"
                    title="Ahmed Hassan completed Surah Al-Baqarah (verses 1-20)"
                    time="10:45 AM"
                    user="Sarah Johnson (Teacher)"
                    badge="Class"
                    onViewDetails={() => handleViewDetails("Ahmed Hassan completed Surah Al-Baqarah")}
                  />

                  <ActivityItem
                    icon={<FileText className="h-4 w-4 text-green-600" />}
                    iconBg="bg-green-100"
                    title="Certificate generated for Sara Ahmed"
                    time="9:30 AM"
                    user="Admin"
                    badge="Certificate"
                    onViewDetails={() => handleViewDetails("Certificate generated for Sara Ahmed")}
                    actions={
                      <>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </>
                    }
                  />

                  <ActivityItem
                    icon={<Calendar className="h-4 w-4 text-blue-600" />}
                    iconBg="bg-blue-100"
                    title="Class scheduled: Arabic Language with Amanda Lee"
                    time="8:15 AM"
                    user="Admin"
                    badge="Schedule"
                    onViewDetails={() => handleViewDetails("Class scheduled: Arabic Language")}
                  />

                  <ActivityItem
                    icon={<Settings className="h-4 w-4 text-slate-600" />}
                    iconBg="bg-slate-100"
                    title="System settings updated by administrator"
                    time="7:30 AM"
                    user="Admin"
                    badge="System"
                    onViewDetails={() => handleViewDetails("System settings updated")}
                  />
                </div>
              </div>

              {/* Yesterday's Activities */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Yesterday - April 10, 2023</h3>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<Users className="h-4 w-4 text-purple-600" />}
                    iconBg="bg-purple-100"
                    title="New student registered: Layla Ibrahim"
                    time="4:30 PM"
                    user="Admin"
                    badge="Registration"
                    onViewDetails={() => handleViewDetails("New student registered: Layla Ibrahim")}
                    actions={
                      <Button variant="ghost" size="sm" className="h-8">
                        <Eye className="h-4 w-4 mr-1" /> View Profile
                      </Button>
                    }
                  />

                  <ActivityItem
                    icon={<GraduationCap className="h-4 w-4 text-amber-600" />}
                    iconBg="bg-amber-100"
                    title="Teacher evaluation completed for Michael Brown"
                    time="2:15 PM"
                    user="Admin"
                    badge="Evaluation"
                    onViewDetails={() => handleViewDetails("Teacher evaluation completed")}
                  />

                  <ActivityItem
                    icon={<BookOpen className="h-4 w-4 text-red-600" />}
                    iconBg="bg-red-100"
                    title="Mohammed Ali missed scheduled class"
                    time="11:00 AM"
                    user="Emily Davis (Teacher)"
                    badge="Absence"
                    onViewDetails={() => handleViewDetails("Mohammed Ali missed class")}
                    actions={
                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageSquare className="h-4 w-4 mr-1" /> Contact
                      </Button>
                    }
                  />

                  <ActivityItem
                    icon={<AlertCircle className="h-4 w-4 text-orange-600" />}
                    iconBg="bg-orange-100"
                    title="Payment reminder sent to 5 students with overdue payments"
                    time="9:00 AM"
                    user="System"
                    badge="Payment"
                    onViewDetails={() => handleViewDetails("Payment reminder sent")}
                  />
                </div>
              </div>

              {/* Earlier Activities */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">April 9, 2023</h3>
                <div className="space-y-4">
                  <ActivityItem
                    icon={<FileText className="h-4 w-4 text-green-600" />}
                    iconBg="bg-green-100"
                    title="Payment received from Omar Youssef"
                    time="3:45 PM"
                    user="Admin"
                    badge="Payment"
                    onViewDetails={() => handleViewDetails("Payment received from Omar Youssef")}
                    actions={
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="h-4 w-4 mr-1" /> Receipt
                      </Button>
                    }
                  />

                  <ActivityItem
                    icon={<Calendar className="h-4 w-4 text-blue-600" />}
                    iconBg="bg-blue-100"
                    title="Class rescheduled for Fatima Khalid"
                    time="1:30 PM"
                    user="Admin"
                    badge="Schedule"
                    onViewDetails={() => handleViewDetails("Class rescheduled for Fatima Khalid")}
                  />

                  <ActivityItem
                    icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                    iconBg="bg-primary/10"
                    title="Sara Ahmed completed Juz Amma memorization"
                    time="11:15 AM"
                    user="Michael Brown (Teacher)"
                    badge="Class"
                    onViewDetails={() => handleViewDetails("Sara Ahmed completed Juz Amma")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Activity</CardTitle>
              <CardDescription>Activities related to students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                iconBg="bg-primary/10"
                title="Ahmed Hassan completed Surah Al-Baqarah (verses 1-20)"
                time="10:45 AM"
                badge="Today"
                onViewDetails={() => handleViewDetails("Ahmed Hassan completed Surah Al-Baqarah")}
              />

              <ActivityItem
                icon={<Users className="h-4 w-4 text-purple-600" />}
                iconBg="bg-purple-100"
                title="New student registered: Layla Ibrahim"
                time="4:30 PM"
                badge="Yesterday"
                onViewDetails={() => handleViewDetails("New student registered: Layla Ibrahim")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" /> View Profile
                  </Button>
                }
              />

              <ActivityItem
                icon={<BookOpen className="h-4 w-4 text-red-600" />}
                iconBg="bg-red-100"
                title="Mohammed Ali missed scheduled class"
                time="11:00 AM"
                badge="Yesterday"
                onViewDetails={() => handleViewDetails("Mohammed Ali missed class")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <MessageSquare className="h-4 w-4 mr-1" /> Contact
                  </Button>
                }
              />

              <ActivityItem
                icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
                iconBg="bg-primary/10"
                title="Sara Ahmed completed Juz Amma memorization"
                time="11:15 AM"
                badge="Apr 9"
                onViewDetails={() => handleViewDetails("Sara Ahmed completed Juz Amma")}
              />

              <ActivityItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                iconBg="bg-blue-100"
                title="Fatima Khalid enrolled in Advanced Arabic course"
                time="9:30 AM"
                badge="Apr 8"
                onViewDetails={() => handleViewDetails("Fatima Khalid enrolled in Advanced Arabic")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Activity</CardTitle>
              <CardDescription>Activities related to teachers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                icon={<GraduationCap className="h-4 w-4 text-amber-600" />}
                iconBg="bg-amber-100"
                title="Teacher evaluation completed for Michael Brown"
                time="2:15 PM"
                badge="Yesterday"
                onViewDetails={() => handleViewDetails("Teacher evaluation completed")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" /> View Evaluation
                  </Button>
                }
              />

              <ActivityItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                iconBg="bg-blue-100"
                title="Sarah Johnson submitted student progress reports"
                time="5:30 PM"
                badge="Apr 8"
                onViewDetails={() => handleViewDetails("Sarah Johnson submitted reports")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" /> Download Reports
                  </Button>
                }
              />

              <ActivityItem
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                iconBg="bg-green-100"
                title="Emily Davis completed all scheduled classes"
                time="4:00 PM"
                badge="Apr 8"
                onViewDetails={() => handleViewDetails("Emily Davis completed classes")}
              />

              <ActivityItem
                icon={<Users className="h-4 w-4 text-purple-600" />}
                iconBg="bg-purple-100"
                title="New teacher onboarded: Khalid Rahman"
                time="11:30 AM"
                badge="Apr 7"
                onViewDetails={() => handleViewDetails("New teacher onboarded: Khalid Rahman")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" /> View Profile
                  </Button>
                }
              />

              <ActivityItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                iconBg="bg-blue-100"
                title="Amanda Lee requested time off for next week"
                time="9:15 AM"
                badge="Apr 7"
                onViewDetails={() => handleViewDetails("Amanda Lee requested time off")}
                actions={
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Eye className="h-4 w-4 mr-1" /> View Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Time Off Request</DialogTitle>
                        <DialogDescription>Request details for Amanda Lee</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Request Details</h4>
                          <p className="text-sm">Teacher: Amanda Lee</p>
                          <p className="text-sm">Dates: April 17-21, 2023</p>
                          <p className="text-sm">Reason: Family vacation</p>
                          <p className="text-sm">Status: Pending approval</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Affected Classes</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Arabic Language - Beginner (3 sessions)</li>
                            <li>• Arabic Language - Intermediate (2 sessions)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Deny</Button>
                        <Button>Approve</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Activity</CardTitle>
              <CardDescription>System and administrative activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ActivityItem
                icon={<FileText className="h-4 w-4 text-green-600" />}
                iconBg="bg-green-100"
                title="Certificate generated for Sara Ahmed"
                time="9:30 AM"
                badge="Today"
                onViewDetails={() => handleViewDetails("Certificate generated for Sara Ahmed")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                }
              />

              <ActivityItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                iconBg="bg-blue-100"
                title="Class scheduled: Arabic Language with Amanda Lee"
                time="8:15 AM"
                badge="Today"
                onViewDetails={() => handleViewDetails("Class scheduled: Arabic Language")}
              />

              <ActivityItem
                icon={<Settings className="h-4 w-4 text-slate-600" />}
                iconBg="bg-slate-100"
                title="System settings updated by administrator"
                time="7:30 AM"
                badge="Today"
                onViewDetails={() => handleViewDetails("System settings updated")}
              />

              <ActivityItem
                icon={<FileText className="h-4 w-4 text-green-600" />}
                iconBg="bg-green-100"
                title="Payment received from Omar Youssef"
                time="3:45 PM"
                badge="Apr 9"
                onViewDetails={() => handleViewDetails("Payment received from Omar Youssef")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" /> Receipt
                  </Button>
                }
              />

              <ActivityItem
                icon={<Calendar className="h-4 w-4 text-blue-600" />}
                iconBg="bg-blue-100"
                title="System backup completed successfully"
                time="12:00 AM"
                badge="Apr 8"
                onViewDetails={() => handleViewDetails("System backup completed")}
              />

              <ActivityItem
                icon={<AlertCircle className="h-4 w-4 text-orange-600" />}
                iconBg="bg-orange-100"
                title="Monthly financial report generated"
                time="9:00 AM"
                badge="Apr 7"
                onViewDetails={() => handleViewDetails("Monthly financial report")}
                actions={
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" /> Download Report
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  time: string
  user?: string
  badge: string
  onViewDetails: () => void
  actions?: React.ReactNode
}

function ActivityItem({ icon, iconBg, title, time, user, badge, onViewDetails, actions }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>{icon}</div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <Badge variant="outline" className="ml-2">
            {badge}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" /> {time}
          {user && (
            <>
              <span className="mx-2">•</span>
              <User className="mr-1 h-3 w-3" /> {user}
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onViewDetails}>
            <Eye className="h-4 w-4 mr-1" /> View Details
          </Button>
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
