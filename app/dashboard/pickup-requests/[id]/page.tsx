"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { MapComponent } from "@/components/map-component"

// Update the mock data structure to match Firebase
const pickupRequestDetails = {
  id: "PR001",
  email: "osas2tek@gmail.com",
  address: "3F4X+GC2, , Abuja Municipal Area Council, 900103",
  latitude: 9.0560246,
  longitude: 7.4984541,
  additionalNotes: "please leave the green bin behind",
  status: "pending",
  timestamp: "May 19, 2025 at 1:59:06 PM UTC+1",
  imageUrls: ["https://res.cloudinary.com/dsojq0cm2/image/upload/v1747659544/images_3_a1sptb.jpg"],
  // Additional fields for UI display that would be fetched separately or computed
  customer: {
    name: "John Doe",
    phone: "+1 (555) 123-4567",
  },
}

// Update the component to use the new data structure
export default function PickupRequestDetailsPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState(pickupRequestDetails.status)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    // In a real app, you would update the status in Firebase here
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
            <h2 className="text-3xl font-bold tracking-tight">Trash Pickup Request #{params.id}</h2>
          </div>
          <p className="text-muted-foreground">View and manage trash pickup request details</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Details about the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{pickupRequestDetails.email}</div>
            </div>
            {pickupRequestDetails.customer?.name && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div>{pickupRequestDetails.customer.name}</div>
              </div>
            )}
            {pickupRequestDetails.customer?.phone && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div>{pickupRequestDetails.customer.phone}</div>
              </div>
            )}
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/users/1`}>View User Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
            <CardDescription>Information about the trash pickup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Requested At</div>
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
              <div className="text-sm font-medium text-muted-foreground">Address</div>
              <div className="flex items-center gap-2">
                <Icons.mapPin className="h-4 w-4 text-muted-foreground" />
                {pickupRequestDetails.address}
              </div>
            </div>
            <div className="h-[300px] w-full overflow-hidden rounded-md border">
              <MapComponent
                center={{ lat: pickupRequestDetails.latitude, lng: pickupRequestDetails.longitude }}
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
              {pickupRequestDetails.imageUrls && pickupRequestDetails.imageUrls.length > 0 ? (
                pickupRequestDetails.imageUrls.map((url, index) => (
                  <div key={index} className="overflow-hidden rounded-md border">
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
  )
}
