/**
 * Migration script to add missing weekly_schedule column
 * Run this if you get: Could not find the 'weekly_schedule' column
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables")
  console.error("Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SUPABASE_SERVICE_ROLE_KEY to your .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateAddWeeklySchedule() {
  console.log("📋 Starting migration: Add weekly_schedule column to students table...")

  try {
    // Add column if it doesn't exist
    const { error: alterError } = await supabase.rpc("exec_sql", {
      sql: `
        ALTER TABLE students
        ADD COLUMN IF NOT EXISTS weekly_schedule jsonb DEFAULT null;
      `,
    })

    if (alterError && !alterError.message.includes("already exists")) {
      throw new Error(`Failed to add column: ${alterError.message}`)
    }

    console.log("✅ Column added successfully")

    // Create index
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_students_weekly_schedule ON students USING GIN (weekly_schedule);
      `,
    })

    if (indexError && !indexError.message.includes("already exists")) {
      console.warn("⚠️ Warning creating index:", indexError.message)
    }

    console.log("✅ Index created successfully")
    console.log("✅ Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

migrateAddWeeklySchedule()
