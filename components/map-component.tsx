"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import dynamic from "next/dynamic";

interface ExtendedRoutingControlOptions
  extends L.Routing.RoutingControlOptions {
  createMarker?: (i: number, wp: L.Routing.Waypoint, n: number) => L.Marker;
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
    if (!mapRef.current || mapInstanceRef.current) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
      iconUrl:
        "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
      shadowUrl: undefined,
    });

    const orsRouter: L.Routing.IRouter = {
      route(
        waypoints: L.Routing.Waypoint[],
        callback: (err: any, routes: any[]) => void,
        context: any,
        options: any
      ) {
        const coords = waypoints.map((wp) => [wp.latLng.lng, wp.latLng.lat]);
        const orsApiKey =
          "5b3ce3597851110001cf624862ba9d9ce4314f088c7a3b8fec0f957e";

        fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${orsApiKey}`,
            },
            body: JSON.stringify({
              coordinates: coords,
              instructions: true,
              instructions_format: "text",
            }),
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("ORS error: " + res.status);
            return res.json();
          })
          .then((data) => {
            const routeCoords = data.features[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]) => L.latLng(lat, lng)
            );

            const segment = data.features[0].properties.segments?.[0];
            const steps = segment?.steps || [];

            const instructions = steps.map((step: any, index: number) => ({
              type: step.type ?? 0,
              distance: step.distance ?? 0,
              time: step.duration ?? 0,
              text: step.instruction ?? "",
              index: step.way_points?.[0] ?? index,
            }));

            const summary = {
              totalDistance: segment?.distance ?? 0,
              totalTime: segment?.duration ?? 0,
            };

            const route: any = {
              name: "Route",
              summary: {
                totalDistance: summary.totalDistance,
                totalTime: summary.totalTime,
              },
              coordinates: routeCoords,
              instructions: instructions,
              inputWaypoints: waypoints,
              actualWaypoints: waypoints.map((wp) => wp.latLng),
              waypoints: waypoints.map((wp) => wp.latLng),
              waypointIndices: [0, routeCoords.length - 1],
              bounds: L.latLngBounds(routeCoords),
              isSimplified: true,
            };

            callback.call(context, null, [route]);
          })
          .catch((err) => {
            console.error("Routing error:", err.message);
            callback.call(context, { message: err.message }, []);
          });
      },
    };

    const initializeMap = (lat: number, lng: number, showRoute: boolean) => {
      const map = L.map(mapRef.current!).setView([lat, lng], zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      if (showRoute) {
        const start = L.latLng(lat, lng);
        const end = L.latLng(center.lat, center.lng);

        routingControlRef.current = L.Routing.control({
          waypoints: [start, end],
          router: orsRouter,
          routeWhileDragging: false,
          showAlternatives: false,
          lineOptions: {
            styles: [{ color: "red", opacity: 0.8, weight: 5 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          createMarker: (i, wp) =>
            L.marker(wp.latLng, {
              draggable: false,
              icon: L.icon({
                iconUrl:
                  "https://i.postimg.cc/TwPdf2Tx/Pngtree-red-location-icon-sign-with-18125743.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              }),
            }).bindPopup(i === 0 ? "Your Location" : "Pickup Location"),
        } as ExtendedRoutingControlOptions).addTo(map);

        routingControlRef.current.on("routesfound", (e) => {
          console.log("Route found:", e.routes[0]);
        });

        routingControlRef.current.on("routingerror", (e) => {
          console.error("Routing error:", e.error);
        });
      } else {
        // Show just pickup marker
        L.marker([center.lat, center.lng])
          .addTo(map)
          .bindPopup("Pickup Location")
          .openPopup();
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        initializeMap(
          position.coords.latitude,
          position.coords.longitude,
          true
        );
      },
      (err) => {
        console.warn("Geolocation failed:", err.message);
        initializeMap(center.lat, center.lng, false);
      }
    );

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return <div ref={mapRef} className="h-full w-full" />;
}

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
