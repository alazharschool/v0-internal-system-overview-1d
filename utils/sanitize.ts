// utils/sanitize.ts

export function sanitize(input: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>?/gm, "").trim();
}
