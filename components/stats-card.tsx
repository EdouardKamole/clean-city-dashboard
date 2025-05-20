import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;

  icon: React.ReactNode;
  description: string;
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            {title}
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <div className="text-3xl font-bold">{value}</div>
        </div>
        <div className="mt-2 flex items-center text-xs">
          <div className="mt-2 text-xs text-muted-foreground">
            {description}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
