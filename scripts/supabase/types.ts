/**
 * Type definitions for migration system
 */

export interface TableDefinition {
  name: string
  columns: ColumnDefinition[]
  indexes?: IndexDefinition[]
  policies?: PolicyDefinition[]
}

export interface ColumnDefinition {
  name: string
  type: string
  nullable?: boolean
  unique?: boolean
  primaryKey?: boolean
  default?: string
  references?: {
    table: string
    column: string
  }
}

export interface IndexDefinition {
  name: string
  columns: string[]
  unique?: boolean
}

export interface PolicyDefinition {
  name: string
  table: string
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE"
  role: string
  using?: string
  check?: string
}

export interface SeedDefinition {
  table: string
  data: Record<string, any>[]
  condition?: string // SQL condition to check if already seeded
}
