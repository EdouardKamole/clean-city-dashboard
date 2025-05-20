import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

// Mock data - in a real app, this would come from Firebase
const users = {
  "1": {
    id: "1",
    name: "John Doe",
    email: "osas2tek@gmail.com",
    location: "Abuja Municipal Area Council, 900103",
    joinedDate: "2023-01-15",
    phone: "+1 (555) 123-4567",
  },
}

const userRequests = {
  "1": [
    {
      id: "PR001",
      address: "3F4X+GC2, , Abuja Municipal Area Council, 900103",
      status: "pending",
      timestamp: "May 19, 2025 at 1:59:06 PM UTC+1",
      trashType: "Household Waste",
      estimatedWeight: "15 kg",
    },
    {
      id: "PR008",
      address: "3F4X+GC2, , Abuja Municipal Area Council, 900103",
      status: "completed",
      timestamp: "May 10, 2025 at 10:15 AM UTC+1",
      trashType: "Recyclables",
      estimatedWeight: "8 kg",
    },
    {
      id: "PR015",
      address: "3F4X+GC2, , Abuja Municipal Area Council, 900103",
      status: "completed",
      timestamp: "May 5, 2025 at 2:45 PM UTC+1",
      trashType: "Yard Waste",
      estimatedWeight: "20 kg",
    },
  ],
}

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const user = users[params.id]
  const requests = userRequests[params.id] || []

  if (!user) {
    return (
      <div className="container py-8">
        <h2 className="text-3xl font-bold tracking-tight">User not found</h2>
        <p className="text-muted-foreground">The requested user does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/users">Back to Users</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="icon">
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{user.name}'s Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Details about the user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div>{user.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div>{user.phone}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Location</div>
              <div>{user.location}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
              <div>{user.joinedDate}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Requests</div>
              <div className="text-2xl font-bold">{requests.length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Completed Requests</div>
              <div className="text-2xl font-bold">{requests.filter((r) => r.status === "completed").length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending Requests</div>
              <div className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Estimated Waste Collected</div>
              <div className="text-2xl font-bold">
                {requests
                  .filter((r) => r.status === "completed")
                  .reduce((acc, r) => acc + Number.parseInt(r.estimatedWeight), 0)}{" "}
                kg
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trash Pickup Requests</CardTitle>
          <CardDescription>All requests made by this user</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Trash Type</TableHead>
                <TableHead>Estimated Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.timestamp}</TableCell>
                  <TableCell>{request.trashType}</TableCell>
                  <TableCell>{request.estimatedWeight}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {request.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/pickup-requests/${request.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
