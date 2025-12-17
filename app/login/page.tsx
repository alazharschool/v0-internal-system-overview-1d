"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, GraduationCap, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0] Supabase login error:", {
          message: signInError.message,
          status: signInError.status,
          type: signInError.name,
        })
        setError(
          signInError.message === "Invalid login credentials"
            ? "Invalid email or password. Please check your credentials. If this is your first time, contact the administrator to create an admin account."
            : signInError.message,
        )
        return
      }

      if (data?.user) {
        console.log("[v0] Login successful, user:", data.user.email)

        const userRole = data.user.user_metadata?.role || data.user.user_metadata?.is_admin

        if (userRole === "admin" || data.user.email === "admin@alazhar.school") {
          // Redirect to dashboard only for admin
          router.push("/")
          router.refresh()
        } else {
          setError("Access denied. Only administrators can access this system.")
          // Sign out the non-admin user immediately
          await supabase.auth.signOut()
          return
        }
      } else {
        setError("Failed to sign in. Please try again.")
      }
    } catch (err) {
      console.error("[v0] Unexpected login error:", err)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Al-Azhar</h1>
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Quran Online School Management System</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@alazhar.school"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Email: admin@alazhar.school</p>
            <p>Password: mbanora1983</p>
            <p className="mt-2 text-xs">
              <Link href="/setup-wizard" className="text-blue-600 hover:underline font-semibold">
                First time? Follow the Setup Wizard
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
