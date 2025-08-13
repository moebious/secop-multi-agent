"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Gavel, Bell, Settings, Users, TrendingUp } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Procesos",
    href: "/dashboard/procurements",
    icon: FileText,
  },
  {
    title: "Mis Ofertas",
    href: "/dashboard/bids",
    icon: Gavel,
    roles: ["bidder"],
  },
  {
    title: "Notificaciones",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Gestión de Usuarios",
    href: "/dashboard/admin/users",
    icon: Users,
    roles: ["administrator", "procurement_officer"],
  },
  {
    title: "Evaluar Ofertas",
    href: "/dashboard/admin/bids",
    icon: TrendingUp,
    roles: ["administrator", "procurement_officer"],
  },
  {
    title: "Gestionar Procesos",
    href: "/dashboard/admin/procurements",
    icon: Settings,
    roles: ["administrator", "procurement_officer"],
  },
]

interface DashboardNavProps {
  userRole: string
}

export default function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(userRole))

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
