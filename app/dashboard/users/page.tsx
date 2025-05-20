"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "@/firebase"; // Import the Firebase app instance
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  displayName: string;
  email: string;
  location: string;
  joinedDate: string;
  requestCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, "users"); // Replace "users" with your collection name
        const usersSnapshot = await getDocs(usersCollection);
        const usersList: User[] = usersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            displayName: data.displayName || "N/A", // Handle missing data
            email: data.email || "N/A",
            location: data.location || "N/A",
            joinedDate: data.joinedDate || "N/A",
            requestCount: data.requestCount || 0,
          };
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 color="green" className="w-10 h-10 animate-spin" />
      </div>
    ); // Or a more sophisticated loading indicator
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage your application users</p>
        </div>
        {/* <div className="flex items-center gap-2">
          <div className="relative">
            <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8 md:w-[300px]"
            />
          </div>
          <Button>
            <Icons.add className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Pickup Requests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.displayName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>{user.requestCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/users/${user.id}`}>
                        View Requests
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
