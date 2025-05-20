import type { LucideIcon } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: "default" | "ghost"
    href: string
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              link.variant === "default" &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
              isCollapsed && "flex h-9 w-9 shrink-0 items-center justify-center rounded-md p-0",
            )}
          >
            <link.icon className={cn("h-4 w-4", isCollapsed ? "h-5 w-5" : "")} />
            {!isCollapsed && <span>{link.title}</span>}
            {!isCollapsed && link.label && <span className="ml-auto text-xs">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
