"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { StatsCard } from "@/components/stats-card";
import { ActivityCard, ActivityItem } from "@/components/activity-card";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
} from "firebase/firestore";
import app from "@/firebase";
import { useRouter } from "next/navigation";
import { checkUserRole } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activePickups, setActivePickups] = useState(0);
  const [completedPickups, setCompletedPickups] = useState(0);
  const [wasteCollected, setWasteCollected] = useState(0);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [latestPickupStatus, setLatestPickupStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    async function fetchData() {
      const { isAdmin } = await checkUserRole();

      if (!isAdmin) {
        // Redirect to login if not an admin or not authenticated
        router.push("/login");
        return;
      }

      setLoading(false);

      try {
        const db = getFirestore(app);

        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnapshot.size);

        // Fetch active pickups (assuming "pending" status)
        const activePickupsQuery = query(
          collection(db, "pickup_requests"),
          where("status", "==", "pending")
        );
        const activePickupsSnapshot = await getDocs(activePickupsQuery);
        setActivePickups(activePickupsSnapshot.size);

        // Fetch completed pickups
        const completedPickupsQuery = query(
          collection(db, "pickup_requests"),
          where("status", "==", "completed")
        );
        const completedPickupsSnapshot = await getDocs(completedPickupsQuery);
        setCompletedPickups(completedPickupsSnapshot.size);

        // Fetch waste collected (sum of estimatedWeight)
        const pickupRequestsSnapshot = await getDocs(
          collection(db, "pickup_requests")
        );
        let totalWeight = 0;
        pickupRequestsSnapshot.forEach((doc) => {
          const data = doc.data();
          totalWeight += parseFloat(data.estimatedWeight || 0);
        });
        setWasteCollected(totalWeight);

        // Fetch pickup locations
        const locations: any = [];
        pickupRequestsSnapshot.forEach((doc) => {
          const data = doc.data();
          locations.push({
            lat: data.latitude,
            lng: data.longitude,
            status: data.status,
          });
        });
        setPickupLocations(locations);

        // Fetch recent activity (last 5 pickup requests)
        const recentActivityQuery = query(
          collection(db, "pickup_requests"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const recentActivitySnapshot = await getDocs(recentActivityQuery);
        const recentActivityData: ActivityItem[] =
          recentActivitySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              text: `Pickup request ${data.status} at ${data.address}`,
              date: data.timestamp.toDate().toLocaleDateString(),
            };
          });
        setRecentActivity(recentActivityData);

        // Fetch latest pickup status
        const latestPickupQuery = query(
          collection(db, "pickup_requests"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const latestPickupSnapshot = await getDocs(latestPickupQuery);
        if (!latestPickupSnapshot.empty) {
          const latestPickup = latestPickupSnapshot.docs[0].data();
          setLatestPickupStatus(latestPickup.status);
        } else {
          setLatestPickupStatus("No recent pickups");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, Admin
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your trash pickup service today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={<Icons.user className="h-5 w-5" />}
          description="Total registered users"
        />
        <StatsCard
          title="Active Pickups"
          value={activePickups.toString()}
          icon={<Icons.trash className="h-5 w-5" />}
          description="Pending pickup requests"
        />
        <StatsCard
          title="Completed Pickups"
          value={completedPickups.toString()}
          icon={<Icons.checkCircle className="h-5 w-5" />}
          description="All time completed pickups"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pickup Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Current status breakdown
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/pickup-requests">View all</Link>
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Pending Pickups</div>
                    <div className="text-muted-foreground">
                      {activePickups} requests
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-yellow-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Completed Today</div>
                    <div className="text-muted-foreground">
                      {completedPickups} requests
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[15%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Latest Pickup Status</div>
                    <div className="text-muted-foreground">
                      {latestPickupStatus}
                    </div>{" "}
                    {/* Display the status */}
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[94%] rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1 lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">
                    Latest pickup requests
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/pickup-requests">View all</Link>
                </Button>
              </div>
            </div>
            <ActivityCard items={recentActivity} /> {/* Pass the data */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
