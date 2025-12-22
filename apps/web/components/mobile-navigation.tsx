"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Home, LayoutDashboard, FileText, Building, Bell, Settings, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MobileNavigationProps {
  userRole?: string
  userName?: string
}

export default function MobileNavigation({ userRole = "administrator", userName = "Usuario" }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show menu when scrolling down past 100px, hide when scrolling up or at top
      if (currentScrollY < 100) {
        setIsVisible(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navigationItems = [
    {
      title: "INICIO",
      href: "/",
      icon: Home,
      description: "Página principal",
    },
    {
      title: "DASHBOARD",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Panel de control",
    },
    {
      title: "PROCESOS",
      href: "/dashboard/procurements",
      icon: Building,
      description: "Procesos de contratación",
    },
    {
      title: "MIS OFERTAS",
      href: "/dashboard/bids",
      icon: FileText,
      description: "Gestionar ofertas",
      roles: ["bidder", "administrator"],
    },
    {
      title: "NOTIFICACIONES",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "Mensajes y alertas",
    },
    {
      title: "PANEL ADMIN",
      href: "/dashboard/admin",
      icon: Settings,
      description: "Administración",
      roles: ["administrator", "procurement_officer"],
    },
  ]

  const filteredItems = navigationItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  })

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

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div
      className={`lg:hidden fixed top-4 left-4 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="neo-button-primary p-2 shadow-lg" size="sm">
            <Menu className="h-5 w-5" strokeWidth={3} />
            <span className="sr-only">Abrir menú de navegación</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-cream border-4 border-charcoal p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="neo-card rounded-none border-b-4 border-charcoal p-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-black text-charcoal uppercase tracking-wide">NAVEGACIÓN</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-charcoal/10"
                >
                  <X className="h-4 w-4" strokeWidth={3} />
                </Button>
              </div>

              {/* User Info */}
              <div className="mt-4 p-3 neo-card bg-muted-pearl">
                <p className="font-black text-charcoal text-sm uppercase truncate">{userName}</p>
                <Badge className="neo-badge bg-mocha text-cream border-charcoal text-xs mt-2">
                  {getRoleDisplayName(userRole)}
                </Badge>
              </div>
            </SheetHeader>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-2">
                {filteredItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full ${
                        isActive ? "neo-card bg-mocha text-cream" : "neo-card bg-cream hover:bg-muted-pearl"
                      } p-4 transition-all duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${isActive ? "text-cream" : "text-charcoal"}`} strokeWidth={3} />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-black text-sm uppercase tracking-wide ${
                              isActive ? "text-cream" : "text-charcoal"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className={`text-xs font-bold ${isActive ? "text-cream/80" : "text-charcoal/70"}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="neo-card rounded-none border-t-4 border-charcoal p-4 bg-muted-stone">
              <p className="text-xs font-bold text-charcoal/70 uppercase text-center">
                PLATAFORMA MULTI-AGENTE SECOP II
              </p>
              <p className="text-xs font-bold text-charcoal/50 uppercase text-center mt-1">VERSIÓN 1.0</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
