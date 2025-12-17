"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, Copy, ExternalLink } from "lucide-react"

export default function AdminSetupPage() {
  const [serviceRoleKey, setServiceRoleKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const copyToClipboard = () => {
    navigator.clipboard.writeText("admin@alazhar.school / mbanora1983")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validateServiceRoleKey = (key: string): { valid: boolean; message: string } => {
    const trimmedKey = key.trim()

    if (!trimmedKey) {
      return { valid: false, message: "Service Role Key is required" }
    }

    if (!trimmedKey.startsWith("eyJ")) {
      return {
        valid: false,
        message: "Invalid key format. Make sure you copied the 'service_role secret' (not anon key)",
      }
    }

    if (trimmedKey.length < 50) {
      return { valid: false, message: "Service Role Key appears to be incomplete" }
    }

    return { valid: true, message: "" }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const validation = validateServiceRoleKey(serviceRoleKey)
    if (!validation.valid) {
      setError(validation.message)
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Service-Role-Key": serviceRoleKey.trim(),
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 || data.error?.includes("Invalid API key")) {
          setError(
            "Invalid Service Role Key. Make sure you copied the correct key from Supabase Settings → API → service_role secret",
          )
        } else {
          setError(data.error || "Failed to create admin user")
        }
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Admin Account Setup</CardTitle>
          <CardDescription className="text-blue-100">
            Create your administrator account to access the system
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          {success ? (
            <div className="space-y-4 text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-700">Admin Created Successfully!</h2>
              <p className="text-gray-600">Redirecting to login page...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: Get Service Role Key */}
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-bold text-lg mb-3">Step 1: Get Your Service Role Key</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li>
                    1. Go to:{" "}
                    <Link
                      href="https://app.supabase.com/projects"
                      target="_blank"
                      className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                    >
                      Supabase Dashboard <ExternalLink className="h-3 w-3" />
                    </Link>
                  </li>
                  <li>
                    2. Select your project:{" "}
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">qumeveerinufukgpbcyk</span>
                  </li>
                  <li>
                    3. Go to <span className="font-semibold">Settings → API</span>
                  </li>
                  <li>
                    4. Copy the <span className="font-semibold text-red-600">service_role secret</span> (NOT the anon
                    key - different from what's below)
                  </li>
                  <li>
                    5. <span className="text-red-600 font-semibold">IMPORTANT:</span> Make sure you're copying the
                    SERVICE_ROLE key, not the ANON key. They look similar but are different!
                  </li>
                </ol>
              </div>

              {/* Step 2: Paste Key and Create Admin */}
              <form onSubmit={handleCreateAdmin} className="space-y-4 border-l-4 border-indigo-600 pl-4 py-2">
                <h3 className="font-bold text-lg">Step 2: Create Admin Account</h3>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="serviceRoleKey" className="font-semibold">
                    Service Role Key
                  </Label>
                  <Input
                    id="serviceRoleKey"
                    type="password"
                    placeholder="eyJ0eXAiOiJKV1QiLCJhbGc..."
                    value={serviceRoleKey}
                    onChange={(e) => setServiceRoleKey(e.target.value)}
                    disabled={loading}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-gray-500">
                    Your key is only used to create the admin account and is never stored.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                  disabled={loading || !serviceRoleKey.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Admin Account...
                    </>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </form>

              {/* Admin Credentials */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-bold text-amber-900 mb-2">Your Admin Credentials</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-white p-2 rounded">
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-mono">admin@alazhar.school</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded">
                    <div>
                      <p className="text-gray-500 text-xs">Password</p>
                      <p className="font-mono">mbanora1983</p>
                    </div>
                  </div>
                </div>
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <Copy className="h-3 w-3 mr-1" />
                  {copied ? "Copied!" : "Copy Credentials"}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Only one admin account will be created</li>
                  <li>Save these credentials in a secure location</li>
                  <li>
                    After creation, you can log in at{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                      /login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
