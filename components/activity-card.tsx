import { Icons } from "@/components/icons";

export interface ActivityItem {
  id: string;
  text: string;
  date: string;
}

interface ActivityCardProps {
  items: ActivityItem[];
}

export function ActivityCard({ items }: ActivityCardProps) {
  return (
    <div className="space-y-0 px-6 py-2">
      {items.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 py-4 border-b last:border-0"
        >
          <div
            className={`rounded-full p-2 ${
              activity.text.includes("pending")
                ? "bg-yellow-100 text-yellow-600"
                : activity.text.includes("user")
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {activity.text.includes("pending") && (
              <Icons.trash className="h-4 w-4" />
            )}
            {activity.text.includes("user") && (
              <Icons.users className="h-4 w-4" />
            )}
            {activity.text.includes("completed") && (
              <Icons.checkCircle className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.text}</p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
