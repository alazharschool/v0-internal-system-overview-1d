// utils/sanitize.ts

export function sanitize(input: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "").trim();
}
// ✅ Add this at the end of utils/sanitize.ts
export function sanitizeStudentData(data: any) {
  return {
    name: data?.name?.trim() || "",
    email: data?.email?.trim() || "",
    teacher: data?.teacher || "",
    country: data?.country || "",
    day: data?.day || "",
    time: data?.time || "",
    duration: data?.duration || 0,
    status: data?.status || "نشط",
  };
}
