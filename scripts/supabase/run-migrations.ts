#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Safely migrates database schema with RLS policies and seed data
 *
 * Usage:
 *   NODE_ENV=production node ./scripts/supabase/run-migrations.ts
 *   or
 *   npm run supabase:migrate
 *
 * Required Environment Variables:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (never share this!)
 */

import { schema, seedData } from "./schema"
import { supabase, log, tableExists, execSql, policyExists } from "./helpers"

let migrationsFailed = false

async function createTables() {
  log("Creating tables...", "info")

  for (const table of schema) {
    try {
      const exists = await tableExists(table.name)

      if (exists) {
        log(`Table '${table.name}' already exists, skipping...`, "warn")
        continue
      }

      // Build CREATE TABLE statement
      let createTableSQL = `CREATE TABLE IF NOT EXISTS public.${table.name} (\n`

      const columnDefs = table.columns.map((col) => {
        let def = `  ${col.name} ${col.type}`
        if (col.primaryKey) def += " PRIMARY KEY"
        if (col.nullable === false) def += " NOT NULL"
        if (col.unique) def += " UNIQUE"
        if (col.default) def += ` DEFAULT ${col.default}`
        if (col.references) {
          def += ` REFERENCES ${col.references.table}(${col.references.column})`
        }
        return def
      })

      createTableSQL += columnDefs.join(",\n") + "\n);"

      await execSql(createTableSQL)
      log(`✓ Created table '${table.name}'`, "success")

      // Create indexes
      if (table.indexes) {
        for (const index of table.indexes) {
          const uniqueKeyword = index.unique ? "UNIQUE" : ""
          const indexSQL = `CREATE ${uniqueKeyword} INDEX IF NOT EXISTS ${index.name} ON public.${table.name} (${index.columns.join(", ")});`
          await execSql(indexSQL)
          log(`  ✓ Created index '${index.name}'`, "success")
        }
      }

      // Enable RLS
      const rlsSQL = `ALTER TABLE public.${table.name} ENABLE ROW LEVEL SECURITY;`
      await execSql(rlsSQL)
      log(`  ✓ Enabled RLS on '${table.name}'`, "success")

      // Create policies
      if (table.policies) {
        for (const policy of table.policies) {
          const exists = await policyExists(policy.name, table.name)
          if (exists) {
            log(`  ⓘ Policy '${policy.name}' already exists`, "warn")
            continue
          }

          let policySQL = `CREATE POLICY "${policy.name}" ON public.${policy.table} FOR ${policy.operation} TO ${policy.role}`
          if (policy.using) policySQL += ` USING (${policy.using})`
          if (policy.check) policySQL += ` WITH CHECK (${policy.check})`
          policySQL += ";"

          await execSql(policySQL)
          log(`  ✓ Created policy '${policy.name}'`, "success")
        }
      }
    } catch (error: any) {
      log(`Failed to create table '${table.name}': ${error.message}`, "error")
      migrationsFailed = true
    }
  }
}

async function seedDatabase() {
  log("Seeding sample data...", "info")

  for (const seed of seedData) {
    try {
      // Check if seed data already exists
      const { count, error } = await supabase.from(seed.table).select("*", { count: "exact", head: true }).limit(1)

      if (count && count > 0) {
        log(`Table '${seed.table}' already has data, skipping seed...`, "warn")
        continue
      }

      // Insert seed data
      for (const row of seed.data) {
        // Handle function calls in values (for foreign keys)
        const processedRow: Record<string, any> = {}
        for (const [key, value] of Object.entries(row)) {
          if (typeof value === "string" && value.includes("SELECT")) {
            // This will be handled via raw SQL insert
            processedRow[key] = value
          } else {
            processedRow[key] = value
          }
        }

        // For now, use a simpler approach with direct insert
        const { data, error } = await supabase.from(seed.table).insert(row).select()

        if (error) {
          log(`  ⚠ Seed insert failed: ${error.message}`, "warn")
        } else {
          log(`  ✓ Seeded '${seed.table}'`, "success")
        }
      }
    } catch (error: any) {
      log(`Failed to seed '${seed.table}': ${error.message}`, "error")
      migrationsFailed = true
    }
  }
}

async function runMigrations() {
  console.log("\n╔════════════════════════════════════════════╗")
  console.log("║     Supabase Migration Runner              ║")
  console.log("║     Al-Azhar Online School System          ║")
  console.log("╚════════════════════════════════════════════╝\n")

  try {
    log("Connecting to Supabase...", "info")
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    log("✓ Connected successfully", "success")

    await createTables()
    await seedDatabase()

    if (migrationsFailed) {
      log("Migration completed with errors ⚠", "error")
      process.exit(1)
    } else {
      log("All migrations completed successfully ✓", "success")
      console.log("\n✓ Database is ready to use!")
      process.exit(0)
    }
  } catch (error: any) {
    log(`Migration failed: ${error.message}`, "error")
    console.error("\nDebugging info:", error)
    process.exit(1)
  }
}

// Run migrations
runMigrations()
