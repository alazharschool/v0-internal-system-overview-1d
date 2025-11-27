/**
 * Helper functions for safe SQL execution
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("[Migration] Missing required environment variables:")
  console.error("  - SUPABASE_URL:", SUPABASE_URL ? "✓" : "✗")
  console.error("  - SUPABASE_SERVICE_ROLE_KEY:", SERVICE_ROLE_KEY ? "✓" : "✗")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function execSql(sql: string): Promise<any> {
  try {
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("[SQL Error]", error)
      throw error
    }

    return data
  } catch (error: any) {
    console.error("[SQL Execution Failed]", error.message)
    throw error
  }
}

export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return !!data
  } catch (error) {
    console.error(`[Table Check] Error checking ${tableName}:`, error)
    return false
  }
}

export async function columnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("information_schema.columns")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .eq("column_name", columnName)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return !!data
  } catch (error) {
    return false
  }
}

export async function policyExists(policyName: string, tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("pg_policies")
      .select("policyname")
      .eq("policyname", policyName)
      .eq("tablename", tableName)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return !!data
  } catch (error) {
    return false
  }
}

export async function seedExists(condition: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("check_seed_exists", { condition })
    if (error) throw error
    return !!data
  } catch (error) {
    return false
  }
}

export function log(message: string, level: "info" | "success" | "error" | "warn" = "info") {
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
  const prefix = `[${timestamp}]`

  switch (level) {
    case "success":
      console.log(`\x1b[32m${prefix} ✓ ${message}\x1b[0m`)
      break
    case "error":
      console.error(`\x1b[31m${prefix} ✗ ${message}\x1b[0m`)
      break
    case "warn":
      console.warn(`\x1b[33m${prefix} ⚠ ${message}\x1b[0m`)
      break
    default:
      console.log(`\x1b[36m${prefix} ℹ ${message}\x1b[0m`)
  }
}

export { supabase }
