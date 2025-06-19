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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import app from "@/firebase";
import { Timestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { checkUserRole } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PickupRequest {
  id: string;
  email: string;
  address: string;
  status: string;
  timestamp: Timestamp;
  customer: string;
}

export default function PickupRequestsPage() {
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchPickupRequests() {
      const { isAdmin } = await checkUserRole();

      if (!isAdmin) {
        router.push("/login");
        return;
      }
      try {
        const db = getFirestore(app);
        const pickupRequestsCollection = collection(db, "pickup_requests");
        const q = query(pickupRequestsCollection, orderBy("timestamp", "desc"));
        const pickupRequestsSnapshot = await getDocs(q);
        const pickupRequestsList: PickupRequest[] =
          pickupRequestsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              email: data.email,
              address: data.address,
              status: data.status,
              timestamp: data.timestamp,
              customer: data.customer,
            } as PickupRequest;
          });
        setPickupRequests(pickupRequestsList);
      } catch (error) {
        console.error("Error fetching pickup requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPickupRequests();
  }, []);

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 color="green" className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const formatDate = (timestamp: Timestamp) => {
    // Function to format the Timestamp
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Trash Pickup Requests
          </h2>
          <p className="text-muted-foreground">
            Manage all trash pickup requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Trash Pickup Requests</CardTitle>
          <CardDescription>
            A list of all trash pickup requests in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="truncate">
                    {request.address.length > 50
                      ? request.address.substring(0, 25) + "..."
                      : request.address}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(request.timestamp)}</TableCell>{" "}
                  {/* Format the timestamp */}
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
