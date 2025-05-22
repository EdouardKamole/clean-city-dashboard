"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "@/components/icons";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import app from "@/firebase";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; // Assuming you have a toast component for notifications
import { checkUserRole } from "@/lib/utils";

interface User {
  id: string;
  displayName: string;
  email: string;
  location: string;
  joinedDate: string;
  phone: string;
  role: string; // Added role field
}

interface Request {
  id: string;
  address: string;
  status: string;
  timestamp: string;
  trashType: string;
  estimatedWeight: string;
}

export default function UserDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { isAdmin } = await checkUserRole();

      if (!isAdmin) {
        // Redirect to login if not an admin or not authenticated
        router.push("/login");
        return;
      }

      try {
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", params.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUser({
            id: userDocSnap.id,
            ...userDocSnap.data(),
          } as User);
        } else {
          setUser(null);
        }

        const pickupRequestsCollectionRef = collection(db, "pickup_requests");
        const q = query(
          pickupRequestsCollectionRef,
          where("userId", "==", params.id)
        );
        const pickupRequestsSnapshot = await getDocs(q);
        const pickupRequestsList: Request[] = pickupRequestsSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Request[];
        setRequests(pickupRequestsList);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [params.id]);

  // Function to toggle user role
  const handleRoleToggle = async () => {
    if (!user) return;

    setRoleUpdating(true);
    try {
      const db = getFirestore(app);
      const userDocRef = doc(db, "users", user.id);
      const newRole = user.role === "admin" ? "user" : "admin";

      // Update the role in Firestore
      await updateDoc(userDocRef, { role: newRole });

      // Update local state
      setUser({ ...user, role: newRole });

      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    } finally {
      setRoleUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 color="green" className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <h2 className="text-3xl font-bold tracking-tight">User not found</h2>
        <p className="text-muted-foreground">
          The requested user does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/users">
          <Button variant="ghost" size="icon">
            <Icons.chevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {user.displayName}'s Profile
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Details about the user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Name
              </div>
              <div>{user.displayName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Role
              </div>
              <div className="flex items-center gap-2">
                <span>{user.role}</span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleRoleToggle}
                  disabled={roleUpdating}
                >
                  {roleUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {user?.role === "admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </>
                  )}
                </Button>
              </div>
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
              <div className="text-sm font-medium text-muted-foreground">
                Total Requests
              </div>
              <div className="text-2xl font-bold">{requests.length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Completed Requests
              </div>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "completed").length}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </div>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "pending").length}
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.timestamp}</TableCell>
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
                      <Link href={`/dashboard/pickup-requests/${request.id}`}>
                        View Details
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
