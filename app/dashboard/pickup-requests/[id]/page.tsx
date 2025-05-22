"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { MapComponent } from "@/components/map-component";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import app from "@/firebase";
import { Loader2 } from "lucide-react";

interface PickupRequest {
  id: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  additionalNotes: string;
  status: string;
  timestamp: string;
  imageUrls: string[];
  customer?: {
    name: string;
    phone: string;
  };
}

interface Params {
  id: string;
}

interface Props {
  params: Params;
}

export default function PickupRequestDetailsPage({ params }: Props) {
  const [pickupRequestDetails, setPickupRequestDetails] =
    useState<PickupRequest | null>(null);
  const [status, setStatus] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // new state
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        redirect("/login");
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    async function fetchPickupRequestDetails() {
      try {
        setLoading(true);
        const db = getFirestore(app);
        const pickupRequestDocRef = doc(db, "pickup_requests", params.id);

        const pickupRequestDocSnap = await getDoc(pickupRequestDocRef);

        if (pickupRequestDocSnap.exists()) {
          const data = pickupRequestDocSnap.data();
          // Convert Timestamp to string
          const timestamp =
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate().toLocaleString() // Convert to readable string
              : data.timestamp;

          setPickupRequestDetails({
            id: pickupRequestDocSnap.id,
            ...data,
            timestamp, // Store as string
          } as PickupRequest);
          setStatus(data.status);
          setSelectedStatus(data.status); // Initialize selectedStatus

          // Fetch user's display name based on email
          const userEmail = data.email;
          if (userEmail) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // Assuming only one user will have this email
              const userData = querySnapshot.docs[0].data();
              setDisplayName(userData.displayName || "N/A"); // Set display name or "N/A" if not available
            } else {
              setDisplayName("N/A"); // Set "N/A" if user not found
            }
          } else {
            setDisplayName("N/A"); // Set "N/A" if email is not available
          }
        } else {
          console.log("Pickup request not found");
          setPickupRequestDetails(null);
        }
      } catch (error) {
        console.error("Error fetching pickup request details:", error);
        setDisplayName("N/A"); // Set "N/A" in case of error
      } finally {
        setLoading(false);
      }
    }

    fetchPickupRequestDetails();
  }, [params.id, authChecked]);

  const handleStatusChange = async () => {
    try {
      setLoading(true);
      const db = getFirestore(app);
      const pickupRequestDocRef = doc(db, "pickup_requests", params.id);

      await updateDoc(pickupRequestDocRef, { status: selectedStatus }); // Use selectedStatus

      setStatus(selectedStatus); // Update status state

      setPickupRequestDetails((prevDetails) => {
        if (prevDetails) {
          return { ...prevDetails, status: selectedStatus };
        }
        return prevDetails;
      });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 color="green" className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!pickupRequestDetails) {
    return <div>Pickup request not found.</div>;
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/pickup-requests">
              <Button variant="ghost" size="icon">
                <Icons.chevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">
              Trash Pickup Request #{params.id}
            </h2>
          </div>
          <p className="text-muted-foreground">
            View and manage trash pickup request details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            {" "}
            {/* Update selectedStatus */}
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleStatusChange}>Update Status</Button>{" "}
          {/* Add update button */}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Details about the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayName && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div>{displayName}</div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div>{pickupRequestDetails.email}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
            <CardDescription>
              Information about the trash pickup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Status
              </div>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "in progress"
                    ? "bg-blue-100 text-blue-800"
                    : status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Requested At
              </div>
              <div>{pickupRequestDetails.timestamp}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Pickup location details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Address
              </div>
              <div className="flex items-center gap-2">
                <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                {pickupRequestDetails.address}
              </div>
            </div>
            <div className="h-[300px] w-full overflow-hidden rounded-md border">
              <MapComponent
                center={{
                  lat: pickupRequestDetails.latitude,
                  lng: pickupRequestDetails.longitude,
                }}
                zoom={14}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{pickupRequestDetails.additionalNotes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Uploaded images of trash</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {pickupRequestDetails.imageUrls &&
              pickupRequestDetails.imageUrls.length > 0 ? (
                pickupRequestDetails.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-md border"
                  >
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Trash pickup image ${index + 1}`}
                      width={400}
                      height={300}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="No image available"
                    width={400}
                    height={300}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
