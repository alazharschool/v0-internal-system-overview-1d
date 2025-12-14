// lib/utils.ts
// Utilities فقط – بدون Server Actions

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}
