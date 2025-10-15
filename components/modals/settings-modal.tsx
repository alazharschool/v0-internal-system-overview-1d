"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SettingsModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    instituteName: "Islamic Learning Center",
    instituteEmail: "admin@islamiclearning.com",
    institutePhone: "+1 (555) 123-4567",
    instituteAddress: "123 Education Street, Learning City",
    timezone: "UTC+4",
    currency: "USD",
    language: "en",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,

    // Class Settings
    defaultClassDuration: "60",
    maxStudentsPerClass: "10",
    bookingAdvanceTime: "24",
    cancellationPolicy: "24",

    // Payment Settings
    paymentMethod: "stripe",
    autoInvoicing: true,
    lateFeePercentage: "5",

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "strong",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      toast({
        title: (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Settings Updated Successfully!
          </div>
        ),
        description: "All system settings have been saved.",
        className: "bg-green-50 border-green-200 text-green-800",
      })
    }, 1500)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
          <DialogDescription>Configure your educational management system settings.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input
                    id="instituteName"
                    value={settings.instituteName}
                    onChange={(e) => handleInputChange("instituteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instituteEmail">Institute Email</Label>
                  <Input
                    id="instituteEmail"
                    type="email"
                    value={settings.instituteEmail}
                    onChange={(e) => handleInputChange("instituteEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutePhone">Institute Phone</Label>
                  <Input
                    id="institutePhone"
                    value={settings.institutePhone}
                    onChange={(e) => handleInputChange("institutePhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC+4">UTC+4 (UAE)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3 (Saudi Arabia)</SelectItem>
                      <SelectItem value="UTC+2">UTC+2 (Egypt)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instituteAddress">Institute Address</Label>
                <Textarea
                  id="instituteAddress"
                  value={settings.instituteAddress}
                  onChange={(e) => handleInputChange("instituteAddress", e.target.value)}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleInputChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => handleInputChange("weeklyReports", checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="classes" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultClassDuration">Default Class Duration (minutes)</Label>
                  <Select
                    value={settings.defaultClassDuration}
                    onValueChange={(value) => handleInputChange("defaultClassDuration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudentsPerClass">Max Students Per Class</Label>
                  <Input
                    id="maxStudentsPerClass"
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => handleInputChange("maxStudentsPerClass", e.target.value)}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingAdvanceTime">Booking Advance Time (hours)</Label>
                  <Input
                    id="bookingAdvanceTime"
                    type="number"
                    value={settings.bookingAdvanceTime}
                    onChange={(e) => handleInputChange("bookingAdvanceTime", e.target.value)}
                    min="1"
                    max="168"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Cancellation Policy (hours)</Label>
                  <Input
                    id="cancellationPolicy"
                    type="number"
                    value={settings.cancellationPolicy}
                    onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                    min="1"
                    max="72"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={settings.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lateFeePercentage">Late Fee Percentage</Label>
                  <Input
                    id="lateFeePercentage"
                    type="number"
                    value={settings.lateFeePercentage}
                    onChange={(e) => handleInputChange("lateFeePercentage", e.target.value)}
                    min="0"
                    max="20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Invoicing</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate invoices</p>
                </div>
                <Switch
                  checked={settings.autoInvoicing}
                  onCheckedChange={(checked) => handleInputChange("autoInvoicing", checked)}
                />
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                    min="5"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select
                    value={settings.passwordPolicy}
                    onValueChange={(value) => handleInputChange("passwordPolicy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
