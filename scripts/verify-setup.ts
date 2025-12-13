/**
 * Verification Script for Al-Azhar Online School System
 * Checks all required configurations before deployment
 */

import { createClient } from "@supabase/supabase-js"

const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

interface VerificationResult {
  step: string
  status: "✅ PASS" | "❌ FAIL" | "⚠️  WARNING"
  message: string
  details?: string
}

const results: VerificationResult[] = []

async function verifyEnvironmentVariables() {
  console.log("\n📋 Checking Environment Variables...")

  const missingVars: string[] = []
  const presentVars: string[] = []

  requiredEnvVars.forEach((varName) => {
    if (process.env[varName]) {
      presentVars.push(varName)
    } else {
      missingVars.push(varName)
    }
  })

  if (missingVars.length === 0) {
    results.push({
      step: "Environment Variables",
      status: "✅ PASS",
      message: "All required environment variables are configured",
      details: presentVars.join(", "),
    })
  } else {
    results.push({
      step: "Environment Variables",
      status: "❌ FAIL",
      message: "Missing required environment variables",
      details: `Missing: ${missingVars.join(", ")}`,
    })
  }
}

async function verifySupabaseConnection() {
  console.log("\n🔌 Checking Supabase Connection...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    results.push({
      step: "Supabase Connection",
      status: "❌ FAIL",
      message: "Cannot test connection - missing credentials",
    })
    return
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.from("students").select("id", { count: "exact", head: true })

    if (error) {
      results.push({
        step: "Supabase Connection",
        status: "❌ FAIL",
        message: "Database connection failed",
        details: error.message,
      })
    } else {
      results.push({
        step: "Supabase Connection",
        status: "✅ PASS",
        message: "Successfully connected to Supabase",
      })
    }
  } catch (error) {
    results.push({
      step: "Supabase Connection",
      status: "❌ FAIL",
      message: "Error connecting to Supabase",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

async function verifyDatabaseTables() {
  console.log("\n🗄️  Checking Database Tables...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    results.push({
      step: "Database Tables",
      status: "⚠️  WARNING",
      message: "Cannot verify tables - missing credentials",
    })
    return
  }

  const requiredTables = [
    "students",
    "teachers",
    "classes",
    "trial_classes",
    "invoices",
    "payments",
    "certificates",
    "activity_logs",
  ]

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const missingTables: string[] = []
    const existingTables: string[] = []

    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select("id", { count: "exact", head: true })

      if (error && error.message.includes("does not exist")) {
        missingTables.push(table)
      } else {
        existingTables.push(table)
      }
    }

    if (missingTables.length === 0) {
      results.push({
        step: "Database Tables",
        status: "✅ PASS",
        message: "All required tables exist",
        details: `${existingTables.length} tables verified`,
      })
    } else {
      results.push({
        step: "Database Tables",
        status: "❌ FAIL",
        message: "Missing database tables",
        details: `Missing: ${missingTables.join(", ")}`,
      })
    }
  } catch (error) {
    results.push({
      step: "Database Tables",
      status: "❌ FAIL",
      message: "Error checking tables",
      details: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

async function verifyNodeVersion() {
  console.log("\n🔧 Checking Node.js Version...")

  const nodeVersion = process.version
  const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

  if (majorVersion >= 18) {
    results.push({
      step: "Node.js Version",
      status: "✅ PASS",
      message: `Node.js ${nodeVersion} meets requirements (>=18.0.0)`,
    })
  } else {
    results.push({
      step: "Node.js Version",
      status: "❌ FAIL",
      message: `Node.js ${nodeVersion} is below minimum requirement (18.0.0)`,
    })
  }
}

function verifyPackageJson() {
  console.log("\n📦 Checking package.json...")

  try {
    const packageJson = require("../package.json")

    if (packageJson.dependencies.next === "15.5.7") {
      results.push({
        step: "Next.js Version",
        status: "✅ PASS",
        message: "Next.js 15.5.7 installed (CVE-2025-66478 patched)",
      })
    } else {
      results.push({
        step: "Next.js Version",
        status: "⚠️  WARNING",
        message: `Next.js version is ${packageJson.dependencies.next}, expected 15.5.7`,
      })
    }

    if (packageJson.dependencies["@supabase/ssr"] && packageJson.dependencies["@supabase/supabase-js"]) {
      results.push({
        step: "Supabase Packages",
        status: "✅ PASS",
        message: "Supabase packages installed correctly",
      })
    } else {
      results.push({
        step: "Supabase Packages",
        status: "❌ FAIL",
        message: "Missing Supabase packages",
      })
    }
  } catch (error) {
    results.push({
      step: "Package Configuration",
      status: "❌ FAIL",
      message: "Cannot read package.json",
    })
  }
}

function printResults() {
  console.log("\n" + "=".repeat(80))
  console.log("🎯 VERIFICATION RESULTS")
  console.log("=".repeat(80) + "\n")

  let passCount = 0
  let failCount = 0
  let warningCount = 0

  results.forEach((result) => {
    console.log(`${result.status} ${result.step}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Details: ${result.details}`)
    }
    console.log()

    if (result.status === "✅ PASS") passCount++
    else if (result.status === "❌ FAIL") failCount++
    else if (result.status === "⚠️  WARNING") warningCount++
  })

  console.log("=".repeat(80))
  console.log(`📊 Summary: ${passCount} passed, ${failCount} failed, ${warningCount} warnings`)
  console.log("=".repeat(80) + "\n")

  if (failCount === 0 && warningCount === 0) {
    console.log("✅ ALL CHECKS PASSED - Ready for deployment!\n")
    process.exit(0)
  } else if (failCount > 0) {
    console.log("❌ DEPLOYMENT BLOCKED - Fix failed checks before deploying\n")
    process.exit(1)
  } else {
    console.log("⚠️  WARNINGS DETECTED - Review warnings before deploying\n")
    process.exit(0)
  }
}

async function main() {
  console.log("🚀 Al-Azhar Online School - Deployment Verification")
  console.log("=" + "=".repeat(79))

  try {
    verifyNodeVersion()
    verifyPackageJson()
    await verifyEnvironmentVariables()
    await verifySupabaseConnection()
    await verifyDatabaseTables()

    printResults()
  } catch (error) {
    console.error("\n❌ Verification failed with error:", error)
    process.exit(1)
  }
}

main()
