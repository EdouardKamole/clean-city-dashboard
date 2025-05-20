import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { StatsCard } from "@/components/stats-card"
import { ActivityCard } from "@/components/activity-card"
import { PickupChart } from "@/components/pickup-chart"
import { PickupMap } from "@/components/pickup-map"

export default function DashboardPage() {
  // Mock data for the map
  const pickupLocations = [
    { lat: 9.0560246, lng: 7.4984541, status: "pending" },
    { lat: 9.0660246, lng: 7.4884541, status: "completed" },
    { lat: 9.0460246, lng: 7.5084541, status: "pending" },
    { lat: 9.0760246, lng: 7.4784541, status: "completed" },
    { lat: 9.0360246, lng: 7.5184541, status: "pending" },
  ]

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, Admin</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your trash pickup service today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="128"
          change="+10%"
          trend="up"
          icon={<Icons.users className="h-5 w-5" />}
          description="Total registered users"
        />
        <StatsCard
          title="Active Pickups"
          value="24"
          change="+5%"
          trend="up"
          icon={<Icons.trash className="h-5 w-5" />}
          description="Pending pickup requests"
        />
        <StatsCard
          title="Completed Pickups"
          value="573"
          change="+12%"
          trend="up"
          icon={<Icons.checkCircle className="h-5 w-5" />}
          description="All time completed pickups"
        />
        <StatsCard
          title="Waste Collected"
          value="2.4"
          unit="tons"
          change="+8%"
          trend="up"
          icon={<Icons.scale className="h-5 w-5" />}
          description="Total waste collected"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pickup Requests Trend</h3>
                  <p className="text-sm text-muted-foreground">Daily pickup requests over time</p>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  This Month
                </Button>
              </div>
            </div>
            <div className="h-[300px] w-full p-6">
              <PickupChart />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1 lg:col-span-1 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">Latest pickup requests</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/pickup-requests">View all</Link>
                </Button>
              </div>
            </div>
            <ActivityCard />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pickup Locations</h3>
                  <p className="text-sm text-muted-foreground">Active pickup requests on map</p>
                </div>
                <Button variant="outline" size="sm">
                  <Icons.mapPin className="mr-2 h-4 w-4" />
                  View Full Map
                </Button>
              </div>
            </div>
            <div className="h-[300px] w-full p-6">
              <PickupMap locations={pickupLocations} />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pickup Status</h3>
                  <p className="text-sm text-muted-foreground">Current status breakdown</p>
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
                    <div className="text-muted-foreground">24 requests</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[30%] rounded-full bg-yellow-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Completed Today</div>
                    <div className="text-muted-foreground">12 requests</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[15%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Completion Rate</div>
                    <div className="text-muted-foreground">94%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[94%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/pickup-requests">
                      <Icons.plus className="mr-2 h-4 w-4" />
                      Create New Pickup
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
