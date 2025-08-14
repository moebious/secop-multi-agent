import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import MobileNavigation from "@/components/mobile-navigation"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Multi-Agent Procurement Platform",
  description: "SECOP II Colombian Procurement System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${dmSans.style.fontFamily};
  --font-sans: ${dmSans.style.fontFamily};
}
        `}</style>
      </head>
      <body className={dmSans.className}>
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <MobileNavigation />
        </div>
        {children}
      </body>
    </html>
  )
}
