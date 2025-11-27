/**
 * Utility script to check current Supabase database schema
 * Run this to verify all expected columns exist
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log("🔍 Checking Supabase database schema...\n")

  try {
    // Check students table
    const { data, error } = await supabase.from("students").select("*").limit(1)

    if (error) {
      console.error("❌ Error accessing students table:", error.message)
      return
    }

    console.log("✅ Students table exists")
    console.log("📋 Columns found:")

    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      columns.forEach((col) => {
        console.log(`   - ${col}`)
      })
    }

    // Check for weekly_schedule
    const columns = Object.keys(data?.[0] || {})
    if (columns.includes("weekly_schedule")) {
      console.log("\n✅ weekly_schedule column EXISTS")
    } else {
      console.log("\n❌ weekly_schedule column MISSING - Run migration!")
    }
  } catch (error) {
    console.error("❌ Error checking schema:", error)
  }
}

checkSchema()
