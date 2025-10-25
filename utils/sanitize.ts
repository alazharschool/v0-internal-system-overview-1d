import type { Student } from "@/lib/database"

export function sanitizeStudentData(data: any): Omit<Student, "id" | "created_at" | "updated_at"> {
  return {
    name: String(data.name || "").trim(),
    email: String(data.email || "")
      .trim()
      .toLowerCase(),
    phone: String(data.phone || "").trim() || undefined,
    age: data.age ? Number(data.age) : undefined,
    grade: String(data.grade || "").trim() || undefined,
    subject: String(data.subject || "").trim() || undefined,
    parent_name: String(data.parent_name || "").trim() || undefined,
    parent_phone: String(data.parent_phone || "").trim() || undefined,
    parent_email: String(data.parent_email || "").trim() || undefined,
    address: String(data.address || "").trim() || undefined,
    status: (data.status === "inactive" || data.status === "graduated" ? data.status : "active") as any,
    enrollment_date: data.enrollment_date || new Date().toISOString().split("T")[0],
    notes: String(data.notes || "").trim() || undefined,
  }
}
