import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  unit?: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
  description: string
}

export function StatsCard({ title, value, unit, change, trend, icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
        </div>
        <div className="mt-2 flex items-baseline">
          <div className="text-3xl font-bold">{value}</div>
          {unit && <div className="ml-1 text-xl font-semibold text-muted-foreground">{unit}</div>}
        </div>
        <div className="mt-2 flex items-center text-xs">
          <div
            className={cn(
              "flex items-center",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {trend === "up" && <Icons.trendingUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <Icons.trendingDown className="mr-1 h-3 w-3" />}
            {trend === "neutral" && <Icons.minus className="mr-1 h-3 w-3" />}
            {change}
          </div>
          <div className="ml-2 text-muted-foreground">from last month</div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  )
}
