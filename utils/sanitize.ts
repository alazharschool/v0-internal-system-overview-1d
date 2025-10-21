// utils/sanitize.ts

export function sanitize(input: string): string {
  if (!input) return ""
  return input.replace(/<[^>]*>?/gm, "").trim()
}

// Helper function to sanitize student data - only include fields that exist in schema
export const sanitizeStudentData = (data: any) => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    age: data.age ? Number.parseInt(data.age) : undefined,
    grade: data.grade,
    subject: data.subject,
    parent_name: data.parent_name,
    parent_phone: data.parent_phone,
    parent_email: data.parent_email,
    address: data.address,
    status: data.status || "active",
    enrollment_date: data.enrollment_date || new Date().toISOString().split("T")[0],
    notes: data.notes,
  }
}
