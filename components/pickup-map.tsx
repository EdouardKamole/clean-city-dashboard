"use client"

import { useEffect, useRef } from "react"

interface PickupLocation {
  lat: number
  lng: number
  status: string
}

interface PickupMapProps {
  locations: PickupLocation[]
}

export function PickupMap({ locations }: PickupMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Clear any existing content
    mapRef.current.innerHTML = ""

    // Create a map container
    const mapContainer = mapRef.current
    mapContainer.style.position = "relative"
    mapContainer.style.backgroundColor = "#e5e7eb"
    mapContainer.style.borderRadius = "0.5rem"
    mapContainer.style.overflow = "hidden"

    // Find center of all locations
    const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
    const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length

    // Add a watermark
    const watermark = document.createElement("div")
    watermark.style.position = "absolute"
    watermark.style.bottom = "10px"
    watermark.style.right = "10px"
    watermark.style.padding = "4px 8px"
    watermark.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
    watermark.style.borderRadius = "4px"
    watermark.style.fontSize = "10px"
    watermark.style.color = "#6b7280"
    watermark.textContent = "Map data © OpenStreetMap"
    mapContainer.appendChild(watermark)

    // Add a legend
    const legend = document.createElement("div")
    legend.style.position = "absolute"
    legend.style.top = "10px"
    legend.style.left = "10px"
    legend.style.padding = "8px"
    legend.style.backgroundColor = "white"
    legend.style.borderRadius = "4px"
    legend.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)"
    legend.style.zIndex = "1000"
    legend.innerHTML = `
      <div style="font-size: 12px; font-weight: bold; margin-bottom: 5px;">Pickup Status</div>
      <div style="display: flex; align-items: center; margin-bottom: 3px;">
        <div style="width: 10px; height: 10px; background-color: #eab308; border-radius: 50%; margin-right: 5px;"></div>
        <div style="font-size: 11px;">Pending</div>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; margin-right: 5px;"></div>
        <div style="font-size: 11px;">Completed</div>
      </div>
    `
    mapContainer.appendChild(legend)

    // Add pins for each location
    locations.forEach((location, index) => {
      const pin = document.createElement("div")
      pin.style.position = "absolute"

      // Calculate position (this is a simple approximation)
      // In a real app, you would use proper map projection
      const latOffset = (location.lat - centerLat) * 10000
      const lngOffset = (location.lng - centerLng) * 10000

      pin.style.top = `calc(50% - ${latOffset}px)`
      pin.style.left = `calc(50% + ${lngOffset}px)`
      pin.style.transform = "translate(-50%, -50%)"
      pin.style.width = "12px"
      pin.style.height = "12px"
      pin.style.backgroundColor = location.status === "pending" ? "#eab308" : "#10b981"
      pin.style.borderRadius = "50%"
      pin.style.border = "2px solid white"
      pin.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.2)"
      pin.style.cursor = "pointer"

      // Add a pulse effect for pending requests
      if (location.status === "pending") {
        const pulse = document.createElement("div")
        pulse.style.position = "absolute"
        pulse.style.top = "50%"
        pulse.style.left = "50%"
        pulse.style.transform = "translate(-50%, -50%)"
        pulse.style.width = "24px"
        pulse.style.height = "24px"
        pulse.style.borderRadius = "50%"
        pulse.style.backgroundColor = "rgba(234, 179, 8, 0.3)"
        pulse.style.animation = "pulse 1.5s infinite"
        pin.appendChild(pulse)

        // Add keyframes for pulse animation
        const style = document.createElement("style")
        style.textContent = `
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
        `
        document.head.appendChild(style)
      }

      // Add tooltip on hover
      pin.title = `Pickup #${index + 1}: ${location.status}`

      mapContainer.appendChild(pin)
    })
  }, [locations])

  return <div ref={mapRef} className="w-full h-full rounded-md" />
}
