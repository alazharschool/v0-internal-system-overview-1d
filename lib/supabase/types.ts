import type { Database } from "./database.types"

export type Tables = Database["public"]["Tables"]
export type Student = Tables["students"]["Row"]
export type Teacher = Tables["teachers"]["Row"]
export type Lesson = Tables["lessons"]["Row"]
export type Attendance = Tables["attendance"]["Row"]
export type Invoice = Tables["invoices"]["Row"]
export type Certificate = Tables["certificates"]["Row"]
