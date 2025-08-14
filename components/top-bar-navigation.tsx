"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Users, Building, FileText, LayoutDashboard, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface TopBarNavigationProps {
  userRole?: string
  userName?: string
}

export default function TopBarNavigation({ userRole = "administrator", userName = "Usuario" }: TopBarNavigationProps) {
  const pathname = usePathname()

  // Don't show on root path
  if (pathname === "/") return null

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "administrator":
        return "ADMINISTRADOR"
      case "procurement_officer":
        return "OFICIAL DE COMPRAS"
      case "bidder":
        return "LICITADOR"
      default:
        return role.toUpperCase()
    }
  }

  const getQuickActions = () => {
    const commonActions = [
      {
        title: "VER TODOS LOS PROCESOS",
        href: "/dashboard/procurements",
        icon: Building,
      },
    ]

    if (userRole === "bidder") {
      return [
        ...commonActions,
        {
          title: "MIS OFERTAS",
          href: "/dashboard/bids",
          icon: FileText,
        },
      ]
    }

    if (["administrator", "procurement_officer"].includes(userRole)) {
      return [
        ...commonActions,
        {
          title: "PANEL ADMIN",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          title: "GESTIONAR USUARIOS",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          title: "GESTIONAR PROCESOS",
          href: "/dashboard/admin/procurements",
          icon: Building,
        },
        {
          title: "EVALUAR OFERTAS",
          href: "/dashboard/admin/bids",
          icon: FileText,
        },
      ]
    }

    return commonActions
  }

  const quickActions = getQuickActions()

  return (
    <div className="hidden lg:block fixed top-4 right-4 z-50">
      <div className="neo-card bg-cream p-3 flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Badge className="neo-badge bg-mocha text-cream border-charcoal text-xs">
            {getRoleDisplayName(userRole)}
          </Badge>
          <span className="font-bold text-charcoal text-sm uppercase">{userName}</span>
        </div>

        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="neo-button-secondary text-sm px-4 py-2">
              ACCIONES RÁPIDAS
              <ChevronDown className="ml-2 h-4 w-4" strokeWidth={3} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 neo-card bg-cream border-4 border-charcoal p-2">
            {/* Home Action */}
            <DropdownMenuItem asChild className="p-0 mb-2">
              <Link
                href="/"
                className="flex items-center gap-3 p-3 neo-card bg-muted-pearl hover:bg-soft-sage transition-colors w-full"
              >
                <Home className="h-4 w-4 text-charcoal" strokeWidth={3} />
                <span className="font-bold text-charcoal text-sm uppercase">INICIO</span>
              </Link>
            </DropdownMenuItem>

            {/* Dashboard Action */}
            <DropdownMenuItem asChild className="p-0 mb-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-3 neo-card bg-muted-pearl hover:bg-soft-sage transition-colors w-full"
              >
                <LayoutDashboard className="h-4 w-4 text-charcoal" strokeWidth={3} />
                <span className="font-bold text-charcoal text-sm uppercase">DASHBOARD</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-charcoal/20 my-2" />

            {/* Quick Actions */}
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <DropdownMenuItem key={action.href} asChild className="p-0 mb-2">
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 p-3 neo-card bg-muted-stone hover:bg-soft-mocha transition-colors w-full"
                  >
                    <Icon className="h-4 w-4 text-charcoal" strokeWidth={3} />
                    <span className="font-bold text-charcoal text-xs uppercase">{action.title}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
