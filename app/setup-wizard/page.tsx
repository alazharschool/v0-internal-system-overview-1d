import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Database, UserPlus, Key, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SetupWizardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Al-Azhar School Setup Wizard</h1>
          <p className="text-gray-600">Complete these steps to initialize your system</p>
        </div>

        {/* Step 1: Create Admin User */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Create Admin User in Supabase
                </CardTitle>
                <CardDescription>This will allow you to log in to the system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Why this step is needed:</strong> The admin account doesn't exist yet in your Supabase database.
                You'll create it manually through the Supabase Dashboard.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="font-semibold text-sm">Follow these steps:</p>

              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  Open your Supabase Dashboard:
                  <Button variant="link" className="ml-2 h-auto p-0" asChild>
                    <a
                      href="https://supabase.com/dashboard/project/qumeveerinufukgpbcyk/auth/users"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Go to Supabase Auth Users
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </a>
                  </Button>
                </li>
                <li>Click the "Add user" dropdown button in the top right</li>
                <li>Select "Create new user"</li>
                <li>
                  Fill in the form:
                  <div className="ml-6 mt-2 space-y-1 bg-white p-3 rounded border">
                    <p>
                      <strong>Email:</strong> <code className="bg-blue-50 px-2 py-1">admin@alazhar.school</code>
                    </p>
                    <p>
                      <strong>Password:</strong> <code className="bg-blue-50 px-2 py-1">mbanora1983</code>
                    </p>
                    <p>
                      <strong>Auto Confirm User:</strong> <span className="text-green-600">✓ Checked</span>
                    </p>
                  </div>
                </li>
                <li>Click "Create user"</li>
              </ol>

              <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-medium">Once created, you can log in with these credentials</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Initialize Database */}
        <Card className="border-2 border-amber-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Initialize Database Tables
                </CardTitle>
                <CardDescription>Create all required tables and seed data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Why this step is needed:</strong> The database tables (students, classes, teachers, etc.) don't
                exist yet. You'll run a SQL script to create them.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <p className="font-semibold text-sm">Follow these steps:</p>

              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  Go to the database setup page:
                  <Button variant="link" className="ml-2 h-auto p-0" asChild>
                    <Link href="/db-setup" className="text-blue-600">
                      Open Database Setup
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </Link>
                  </Button>
                </li>
                <li>Copy the SQL script by clicking the "Copy SQL Script" button</li>
                <li>
                  Open Supabase SQL Editor:
                  <Button variant="link" className="ml-2 h-auto p-0" asChild>
                    <a
                      href="https://supabase.com/dashboard/project/qumeveerinufukgpbcyk/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Go to SQL Editor
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </a>
                  </Button>
                </li>
                <li>Paste the SQL script into the editor</li>
                <li>Click "Run" to execute the script</li>
                <li>Wait for confirmation that all tables were created successfully</li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> This will create 8 tables with sample data including 30 students, 5 teachers,
                  and 150 scheduled classes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Login */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Login to Your System
                </CardTitle>
                <CardDescription>Access the admin dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">After completing steps 1 and 2, you can log in:</p>

              <div className="bg-white p-4 rounded-lg border space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> <code className="bg-gray-100 px-2 py-1">admin@alazhar.school</code>
                </p>
                <p className="text-sm">
                  <strong>Password:</strong> <code className="bg-gray-100 px-2 py-1">mbanora1983</code>
                </p>
              </div>

              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/login">Go to Login Page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Still getting "Invalid login credentials"?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Make sure you checked "Auto Confirm User" when creating the admin account</li>
              <li>Try logging out and back in to Supabase Dashboard</li>
              <li>Verify the email is exactly: admin@alazhar.school</li>
            </ul>

            <p className="mt-4">
              <strong>Database errors?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Make sure the SQL script ran without errors in the SQL Editor</li>
              <li>Check that all 8 tables were created (students, teachers, classes, etc.)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
