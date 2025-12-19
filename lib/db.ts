// app/lib/db.ts
'use server'; // مهم لو هتستخدمه في Server Actions
import { neon } from '@neondatabase/serverless';

// الاتصال بقاعدة Neon باستخدام المتغير اللي حطيته في Vercel
export const sql = neon(process.env.NEON_DATABASE_URL);
