"use client"

import { useEffect, useRef } from "react"

interface MapComponentProps {
  center: { lat: number; lng: number }
  zoom: number
}

export function MapComponent({ center, zoom }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would initialize a map library here
    // For example, with Google Maps:
    // const map = new google.maps.Map(mapRef.current!, {
    //   center,
    //   zoom,
    // })
    // new google.maps.Marker({ position: center, map })

    // For this demo, we'll just create a placeholder
    if (mapRef.current) {
      const mapElement = mapRef.current
      mapElement.style.position = "relative"
      mapElement.style.backgroundColor = "#e5e7eb"

      // Clear any existing content
      mapElement.innerHTML = ""

      // Create a pin element
      const pin = document.createElement("div")
      pin.style.position = "absolute"
      pin.style.top = "50%"
      pin.style.left = "50%"
      pin.style.transform = "translate(-50%, -50%)"
      pin.style.width = "20px"
      pin.style.height = "20px"
      pin.style.backgroundColor = "#10b981" // Green color to match theme
      pin.style.borderRadius = "50%"
      pin.style.border = "2px solid white"

      // Add text showing the coordinates
      const text = document.createElement("div")
      text.style.position = "absolute"
      text.style.top = "60%"
      text.style.left = "50%"
      text.style.transform = "translateX(-50%)"
      text.style.backgroundColor = "white"
      text.style.padding = "4px 8px"
      text.style.borderRadius = "4px"
      text.style.fontSize = "12px"
      text.style.fontWeight = "bold"
      text.textContent = `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`

      mapElement.appendChild(pin)
      mapElement.appendChild(text)
    }
  }, [center, zoom])

  return <div ref={mapRef} className="h-full w-full" />
}
