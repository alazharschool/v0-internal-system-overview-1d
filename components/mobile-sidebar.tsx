"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Menu,
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  BarChart3,
  Activity,
  BookOpen,
} from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: Users },
  { title: "Teachers", href: "/teachers", icon: GraduationCap },
  { title: "Trial Classes", href: "/trial-classes", icon: BookOpen },
  { title: "Schedule", href: "/schedule", icon: Calendar },
  { title: "Payments", href: "/payments", icon: DollarSign },
  { title: "Certificates", href: "/certificates", icon: Award },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Activity", href: "/activity", icon: Activity },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-white">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">Al-Azhar</h1>
            <p className="text-sm text-slate-600">Online School</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-yellow-50 text-yellow-900 font-medium shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-yellow-600" : "text-slate-400")} />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="px-4 py-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-medium">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-700">Online</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
