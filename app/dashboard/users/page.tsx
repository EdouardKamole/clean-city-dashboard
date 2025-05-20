import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Icons } from "@/components/icons"

// Mock data - in a real app, this would come from Firebase
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    location: "123 Main St, New York, NY",
    joinedDate: "2023-01-15",
    requestCount: 8,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    location: "456 Park Ave, Boston, MA",
    joinedDate: "2023-02-20",
    requestCount: 5,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    location: "789 Oak Dr, Chicago, IL",
    joinedDate: "2023-03-10",
    requestCount: 12,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    location: "321 Pine St, San Francisco, CA",
    joinedDate: "2023-01-05",
    requestCount: 3,
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    location: "654 Maple Rd, Seattle, WA",
    joinedDate: "2023-04-12",
    requestCount: 7,
  },
]

export default function UsersPage() {
  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage your application users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search users..." className="w-full pl-8 md:w-[300px]" />
          </div>
          <Button>
            <Icons.add className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in your application</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Pickup Requests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell>{user.requestCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/users/${user.id}`}>View Requests</Link>
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
