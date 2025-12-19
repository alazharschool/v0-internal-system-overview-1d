// app/actions/comments.ts
import { sql } from "@/lib/db";

export async function createComment(comment: string) {
  // هذه الدالة تعمل على السيرفر، تدخل التعليق في جدول comments
  await sql('INSERT INTO comments (comment) VALUES ($1)', [comment]);
}
