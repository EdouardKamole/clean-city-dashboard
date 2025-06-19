"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Extend RoutingControlOptions to include createMarker
interface ExtendedRoutingControlOptions
  extends L.Routing.RoutingControlOptions {
  createMarker?: (i: number, wp: L.Routing.Waypoint, n: number) => L.Marker;
}

// Extend OSRMOptions to include urlParameters
interface ExtendedOSRMOptions extends L.Routing.OSRMOptions {
  urlParameters?: Record<string, string>;
}

interface MapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
}

export function MapComponent({ center, zoom }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
      iconUrl:
        "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });

    // Custom ORS router options
    const orsRouterOptions: ExtendedOSRMOptions = {
      serviceUrl: "https://api.openrouteservice.org/v2/directions/driving-car",
      timeout: 30 * 1000,
      urlParameters: {
        overview: "full",
        geometries: "geojson",
      },
    };

    // Custom ORS router
    const orsRouter = L.Routing.osrmv1(orsRouterOptions);

    // Override route function to add ORS API key in Authorization header
    orsRouter.route = function (
      waypoints: L.Routing.Waypoint[],
      callback: (err?: any, routes?: any[]) => void,
      context?: any,
      options?: any
    ) {
      const orsApiKey =
        "5b3ce3597851110001cf624862ba9d9ce4314f088c7a3b8fec0f957e";
      if (!orsApiKey) {
        console.error("ORS API key is missing");
        callback.call(context, { message: "Missing ORS API key" }, []);
        return;
      }

      const coords = waypoints
        .map((wp) => `${wp.latLng.lng},${wp.latLng.lat}`)
        .join(";");
      const queryParams = new URLSearchParams(
        orsRouterOptions.urlParameters
      ).toString();
      const url = `${orsRouterOptions.serviceUrl}/${coords}?${queryParams}`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${orsApiKey}`,
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message || "ORS API error");
          }
          const route = {
            name: "Route",
            coordinates: data.routes[0].geometry.coordinates.map(
              (c: [number, number]) => [c[1], c[0]]
            ),
            instructions: data.routes[0].segments
              .map((s: any) =>
                s.steps.map((step: any) => ({
                  text: step.instruction,
                  distance: step.distance,
                  time: step.duration,
                }))
              )
              .flat(),
            summary: {
              totalDistance: data.routes[0].summary.distance,
              totalTime: data.routes[0].summary.duration,
            },
          };

          callback.call(context, null, [route]);
        })
        .catch((error) => {
          console.error("Routing error:", error.message);
          callback.call(context, { message: error.message }, []);
        });
    };

    const initializeMap = (
      lat: number,
      lng: number,
      showRoute: boolean = false
    ) => {
      if (mapRef.current && !mapInstanceRef.current) {
        const map = L.map(mapRef.current).setView([lat, lng], zoom);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        if (showRoute) {
          // Add marker for user location
          const userMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Your Location")
            .openPopup();

          // Add marker for pickup location
          const pickupMarker = L.marker([center.lat, center.lng])
            .addTo(map)
            .bindPopup("Pickup Location");

          // Add routing control
          if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
          }

          const useORS =
            "5b3ce3597851110001cf624862ba9d9ce4314f088c7a3b8fec0f957e";

          routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(lat, lng), L.latLng(center.lat, center.lng)],
            router: useORS
              ? orsRouter
              : L.Routing.osrmv1({
                  serviceUrl: "https://router.project-osrm.org/route/v1",
                }),
            routeWhileDragging: true,
            showAlternatives: false,
            lineOptions: {
              styles: [{ color: "red", opacity: 0.7, weight: 5 }],
              extendToWaypoints: true,
              missingRouteTolerance: 0,
            } as L.Routing.LineOptions,
            createMarker: (i: number, wp: L.Routing.Waypoint) =>
              L.marker(wp.latLng, {
                draggable: true,
                icon: L.icon({
                  iconUrl:
                    "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: "",
                  shadowSize: [41, 41],
                }),
              }).bindPopup(i === 0 ? "Your Location" : "Pickup Location"),
          } as ExtendedRoutingControlOptions).addTo(map);

          // Add error handling for routing
          routingControlRef.current.on("routingerror", (e: any) => {
            console.error("Routing error event:", e.error);
            alert("Failed to calculate route. Check console for details.");
          });

          // Log when route is found
          routingControlRef.current.on("routesfound", (e: any) => {});
        } else {
          // Show only pickup location marker
          L.marker([center.lat, center.lng])
            .addTo(map)
            .bindPopup("Pickup Location")
            .openPopup();
        }
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;

          initializeMap(userLat, userLng, true);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          initializeMap(center.lat, center.lng);
        }
      );
    } else {
      initializeMap(center.lat, center.lng);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return <div ref={mapRef} className="h-full w-full" />;
}
