"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  BarChart3,
  Activity,
  UserPlus,
} from "lucide-react"

const routes = [
  {
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "الطلاب",
    icon: Users,
    href: "/dashboard/students",
    color: "text-violet-500",
  },
  {
    label: "المعلمون",
    icon: GraduationCap,
    href: "/dashboard/teachers",
    color: "text-pink-700",
  },
  {
    label: "الجدول الزمني",
    icon: Calendar,
    href: "/dashboard/schedule",
    color: "text-orange-700",
  },
  {
    label: "الحصص التجريبية",
    icon: UserPlus,
    href: "/dashboard/trial-classes",
    color: "text-emerald-500",
  },
  {
    label: "المدفوعات",
    icon: DollarSign,
    href: "/dashboard/payments",
    color: "text-green-700",
  },
  {
    label: "الشهادات",
    icon: Award,
    href: "/dashboard/certificates",
    color: "text-yellow-500",
  },
  {
    label: "التقارير",
    icon: BarChart3,
    href: "/dashboard/reports",
    color: "text-blue-500",
  },
  {
    label: "السجل",
    icon: Activity,
    href: "/dashboard/activity",
    color: "text-red-500",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 space-y-4", className)}>
      <div className="py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">القائمة الرئيسية</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 ml-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
