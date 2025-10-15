import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Al-Azhar Online School - Management System",
  description: "Comprehensive management system for Al-Azhar Online School",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50 flex">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 overflow-y-auto">
              <Sidebar />
            </div>
          </aside>
          <div className="flex-1 w-full md:ml-0">
            <header className="md:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
              <MobileSidebar />
              <h1 className="text-lg font-bold text-slate-900">Al-Azhar School</h1>
              <div className="w-10" />
            </header>
            <main className="w-full">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
