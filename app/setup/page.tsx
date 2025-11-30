"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  async function handleInitialize() {
    setLoading(true)
    try {
      const response = await fetch("/api/db/init", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setInitialized(true)
        toast({
          title: "Success",
          description: "Database initialized successfully!",
        })
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize database",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function checkStatus() {
    try {
      const response = await fetch("/api/db/status")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Database ready! Students: ${data.studentsCount}, Teachers: ${data.teachersCount}`,
        })
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Database not initialized yet",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="space-y-6 p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Quran Teaching Company</h1>
            <p className="text-gray-600">Initialize your database</p>
          </div>

          {initialized ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-center text-lg font-semibold text-green-700">Database Initialized Successfully!</p>
              <p className="text-center text-sm text-gray-600">Redirecting to dashboard...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">First Time Setup</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Click below to initialize your Supabase database with all tables, indexes, and sample data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleInitialize}
                  disabled={loading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing Database...
                    </>
                  ) : (
                    "Initialize Database"
                  )}
                </Button>

                <Button onClick={checkStatus} variant="outline" className="w-full h-11 bg-transparent">
                  Check Connection
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>This will:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Create 6 database tables</li>
                  <li>Set up indexes for performance</li>
                  <li>Configure Row Level Security</li>
                  <li>Add 4 sample teachers</li>
                  <li>Add sample students and lessons</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
