/**
 * Database schema definition
 * Defines all tables, columns, indexes, and RLS policies
 */

import type { TableDefinition, SeedDefinition } from "./types"

export const schema: TableDefinition[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "email", type: "text", unique: true, nullable: false },
      { name: "name", type: "text", nullable: false },
      { name: "role", type: "text", nullable: false, default: "'student'" }, // admin, teacher, accountant, student
      { name: "phone", type: "text" },
      { name: "profile", type: "jsonb", default: "'{}'" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_users_email", columns: ["email"], unique: true },
      { name: "idx_users_role", columns: ["role"] },
    ],
    policies: [
      {
        name: "Users can view own profile",
        table: "users",
        operation: "SELECT",
        role: "authenticated",
        using: "auth.uid() = id OR (auth.jwt() ->> 'role' = 'admin')",
      },
      {
        name: "Users can update own profile",
        table: "users",
        operation: "UPDATE",
        role: "authenticated",
        using: "auth.uid() = id",
        check: "auth.uid() = id AND (auth.jwt() ->> 'role' = id OR (auth.jwt() ->> 'role' = 'admin'))",
      },
      {
        name: "Admin can manage all users",
        table: "users",
        operation: "SELECT",
        role: "authenticated",
        using: "auth.jwt() ->> 'role' = 'admin'",
      },
    ],
  },

  {
    name: "students",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", references: { table: "users", column: "id" } },
      { name: "name", type: "text", nullable: false },
      { name: "email", type: "text", unique: true, nullable: false },
      { name: "phone", type: "text" },
      { name: "country", type: "text" },
      { name: "status", type: "text", default: "'active'" }, // active, inactive, graduated
      { name: "preferred_teacher_id", type: "uuid", references: { table: "teachers", column: "id" } },
      { name: "weekly_schedule", type: "jsonb", default: "null" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_students_email", columns: ["email"], unique: true },
      { name: "idx_students_status", columns: ["status"] },
      { name: "idx_students_teacher", columns: ["preferred_teacher_id"] },
    ],
    policies: [
      {
        name: "Teachers can view assigned students",
        table: "students",
        operation: "SELECT",
        role: "authenticated",
        using:
          "preferred_teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid()) OR auth.jwt() ->> 'role' = 'admin'",
      },
      {
        name: "Students can view own data",
        table: "students",
        operation: "SELECT",
        role: "authenticated",
        using: "user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin'",
      },
    ],
  },

  {
    name: "teachers",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "user_id", type: "uuid", references: { table: "users", column: "id" } },
      { name: "name", type: "text", nullable: false },
      { name: "email", type: "text", unique: true, nullable: false },
      { name: "phone", type: "text" },
      { name: "bio", type: "text" },
      { name: "specializations", type: "text[]", default: "'{}'" },
      { name: "status", type: "text", default: "'active'" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_teachers_email", columns: ["email"], unique: true },
      { name: "idx_teachers_status", columns: ["status"] },
    ],
  },

  {
    name: "classes",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "teacher_id", type: "uuid", nullable: false, references: { table: "teachers", column: "id" } },
      { name: "student_id", type: "uuid", nullable: false, references: { table: "students", column: "id" } },
      { name: "date", type: "date", nullable: false },
      { name: "time", type: "time", nullable: false },
      { name: "duration_mins", type: "integer", default: "60" },
      { name: "status", type: "text", default: "'scheduled'" }, // scheduled, completed, cancelled, no_show, trial
      { name: "notes", type: "text" },
      { name: "is_trial", type: "boolean", default: "false" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_classes_teacher", columns: ["teacher_id"] },
      { name: "idx_classes_student", columns: ["student_id"] },
      { name: "idx_classes_date", columns: ["date"] },
      { name: "idx_classes_status", columns: ["status"] },
    ],
  },

  {
    name: "invoices",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "student_id", type: "uuid", nullable: false, references: { table: "students", column: "id" } },
      { name: "amount", type: "numeric(10, 2)", nullable: false },
      { name: "currency", type: "text", default: "'USD'" },
      { name: "description", type: "text" },
      { name: "status", type: "text", default: "'pending'" }, // pending, paid, overdue
      { name: "due_date", type: "date" },
      { name: "paid_date", type: "date" },
      { name: "notes", type: "text" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_invoices_student", columns: ["student_id"] },
      { name: "idx_invoices_status", columns: ["status"] },
      { name: "idx_invoices_date", columns: ["created_at"] },
    ],
  },

  {
    name: "payments",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "invoice_id", type: "uuid", nullable: false, references: { table: "invoices", column: "id" } },
      { name: "amount", type: "numeric(10, 2)", nullable: false },
      { name: "payment_method", type: "text", nullable: false }, // bank_transfer, credit_card, paypal, cash
      { name: "transaction_id", type: "text", unique: true },
      { name: "status", type: "text", default: "'completed'" },
      { name: "notes", type: "text" },
      { name: "created_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_payments_invoice", columns: ["invoice_id"] },
      { name: "idx_payments_transaction", columns: ["transaction_id"] },
    ],
  },

  {
    name: "attendance",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "class_id", type: "uuid", nullable: false, references: { table: "classes", column: "id" } },
      { name: "student_id", type: "uuid", nullable: false, references: { table: "students", column: "id" } },
      { name: "status", type: "text", default: "'present'" }, // present, absent, excused
      { name: "note", type: "text" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_attendance_class", columns: ["class_id"] },
      { name: "idx_attendance_student", columns: ["student_id"] },
    ],
  },

  {
    name: "activity_logs",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "actor_id", type: "uuid", references: { table: "users", column: "id" } },
      { name: "action", type: "text", nullable: false }, // created, updated, deleted
      { name: "object_type", type: "text", nullable: false }, // student, teacher, class, invoice, etc.
      { name: "object_id", type: "text", nullable: false },
      { name: "payload", type: "jsonb" },
      { name: "created_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_activity_logs_actor", columns: ["actor_id"] },
      { name: "idx_activity_logs_created", columns: ["created_at"] },
      { name: "idx_activity_logs_object", columns: ["object_type", "object_id"] },
    ],
  },

  {
    name: "courses",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "student_id", type: "uuid", nullable: false, references: { table: "students", column: "id" } },
      { name: "teacher_id", type: "uuid", nullable: false, references: { table: "teachers", column: "id" } },
      { name: "course_name", type: "text", nullable: false },
      { name: "level", type: "text" },
      { name: "status", type: "text", default: "'ongoing'" },
      { name: "start_date", type: "date" },
      { name: "end_date", type: "date" },
      { name: "notes", type: "text" },
      { name: "created_at", type: "timestamp", default: "now()" },
      { name: "updated_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_courses_student", columns: ["student_id"] },
      { name: "idx_courses_teacher", columns: ["teacher_id"] },
      { name: "idx_courses_status", columns: ["status"] },
    ],
  },

  {
    name: "certificates",
    columns: [
      { name: "id", type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
      { name: "student_id", type: "uuid", nullable: false, references: { table: "students", column: "id" } },
      { name: "teacher_id", type: "uuid", nullable: false, references: { table: "teachers", column: "id" } },
      { name: "course_name", type: "text", nullable: false },
      { name: "level", type: "text" },
      { name: "issue_date", type: "date", nullable: false },
      { name: "certificate_number", type: "text", unique: true },
      { name: "notes", type: "text" },
      { name: "created_at", type: "timestamp", default: "now()" },
    ],
    indexes: [
      { name: "idx_certificates_student", columns: ["student_id"] },
      { name: "idx_certificates_teacher", columns: ["teacher_id"] },
    ],
  },
]

export const seedData: SeedDefinition[] = [
  {
    table: "teachers",
    data: [
      {
        name: "Ahmed Al-Mansouri",
        email: "ahmed@alazhar.com",
        phone: "+201001234567",
        bio: "Senior Quran teacher with 10+ years experience",
        specializations: "{Quran,Islamic Studies}",
        status: "active",
      },
    ],
    condition: "email = 'ahmed@alazhar.com'",
  },
  {
    table: "students",
    data: [
      {
        name: "Mohammed Ibrahim",
        email: "student@alazhar.com",
        phone: "+201009876543",
        country: "Egypt",
        status: "active",
      },
    ],
    condition: "email = 'student@alazhar.com'",
  },
  {
    table: "classes",
    data: [
      {
        teacher_id: "(SELECT id FROM teachers WHERE email = 'ahmed@alazhar.com' LIMIT 1)",
        student_id: "(SELECT id FROM students WHERE email = 'student@alazhar.com' LIMIT 1)",
        date: "CURRENT_DATE",
        time: "10:00:00",
        duration_mins: 60,
        status: "scheduled",
        is_trial: true,
      },
    ],
    condition: "is_trial = true AND status = 'scheduled'",
  },
]
