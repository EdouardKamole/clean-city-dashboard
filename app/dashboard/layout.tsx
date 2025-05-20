"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Icons.logo className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <Icons.users className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard/users",
    },
    {
      href: "/dashboard/pickup-requests",
      label: "Trash Pickup Requests",
      icon: <Icons.trash className="mr-2 h-4 w-4" />,
      active: pathname === "/dashboard/pickup-requests" || pathname.startsWith("/dashboard/pickup-requests/"),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Icons.menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="grid gap-2 text-lg font-medium">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
                        route.active ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <Icons.trash className="h-6 w-6 text-primary" />
              <span className="hidden md:inline-block">Trash Pickup Admin</span>
            </Link>
          </div>
          <nav className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center text-sm font-medium ${
                  route.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icons.user className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
