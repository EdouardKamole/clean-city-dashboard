import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

// Mock data - in a real app, this would come from Firebase
const pickupRequests = [
  {
    id: "PR001",
    email: "osas2tek@gmail.com",
    address: "3F4X+GC2, , Abuja Municipal Area Council, 900103",
    status: "pending",
    timestamp: "May 19, 2025 at 1:59:06 PM UTC+1",
    // Additional fields for UI display
    customer: "John Doe",
  },
  {
    id: "PR002",
    email: "jane@example.com",
    address: "456 Park Ave, Boston, MA",
    status: "pending",
    timestamp: "May 18, 2025 at 10:15 AM UTC+1",
    customer: "Jane Smith",
  },
  {
    id: "PR003",
    email: "robert@example.com",
    address: "789 Oak Dr, Chicago, IL",
    status: "completed",
    timestamp: "May 17, 2025 at 2:45 PM UTC+1",
    customer: "Robert Johnson",
  },
  {
    id: "PR004",
    email: "emily@example.com",
    address: "321 Pine St, San Francisco, CA",
    status: "pending",
    timestamp: "May 16, 2025 at 11:20 AM UTC+1",
    customer: "Emily Davis",
  },
  {
    id: "PR005",
    email: "michael@example.com",
    address: "654 Maple Rd, Seattle, WA",
    status: "completed",
    timestamp: "May 15, 2025 at 4:10 PM UTC+1",
    customer: "Michael Wilson",
  },
]

export default function PickupRequestsPage() {
  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trash Pickup Requests</h2>
          <p className="text-muted-foreground">Manage all trash pickup requests</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search requests..." className="w-full pl-8 md:w-[300px]" />
          </div>
          <Button>
            <Icons.add className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trash Pickup Requests</CardTitle>
          <CardDescription>A list of all trash pickup requests in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.customer || request.email}</TableCell>
                  <TableCell>{request.address}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        request.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{request.timestamp}</TableCell>
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
