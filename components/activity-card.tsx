import { Icons } from "@/components/icons"

// Mock data for recent activity
const recentActivity = [
  {
    id: "act1",
    type: "new_request",
    title: "New trash pickup request #1234",
    description: "Requested by John Doe",
    time: "2 hours ago",
  },
  {
    id: "act2",
    type: "new_user",
    title: "New user registered",
    description: "Jane Smith joined the platform",
    time: "5 hours ago",
  },
  {
    id: "act3",
    type: "completed",
    title: "Trash pickup completed",
    description: "Request #1230 marked as completed",
    time: "1 day ago",
  },
  {
    id: "act4",
    type: "new_request",
    title: "New trash pickup request #1229",
    description: "Requested by Robert Johnson",
    time: "1 day ago",
  },
]

export function ActivityCard() {
  return (
    <div className="space-y-0 px-6 py-2">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 py-4 border-b last:border-0">
          <div
            className={`rounded-full p-2 ${
              activity.type === "new_request"
                ? "bg-yellow-100 text-yellow-600"
                : activity.type === "new_user"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
            }`}
          >
            {activity.type === "new_request" && <Icons.trash className="h-4 w-4" />}
            {activity.type === "new_user" && <Icons.users className="h-4 w-4" />}
            {activity.type === "completed" && <Icons.checkCircle className="h-4 w-4" />}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}
