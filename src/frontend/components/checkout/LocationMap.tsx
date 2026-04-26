"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface LocationMapProps {
  onLocationSelect: (address: string, lat: number, lng: number, rawAddr: any, postalCode: string) => void;
  centerLat?: number | null;
  centerLng?: number | null;
}

export default function LocationMap({ onLocationSelect, centerLat, centerLng }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcon();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = centerLat || -6.200000;
    const initialLng = centerLng || 106.816666;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    if (centerLat && centerLng) {
      markerRef.current = L.marker([centerLat, centerLng]).addTo(map);
    }

    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
        );
        const data = await res.json();
        const addr = data.address || {};
        
        const road = addr.road || addr.suburb || "";
        const houseNumber = addr.house_number || "";
        const village = addr.village || addr.hamlet || "";
        const detailedAddress = [road, houseNumber, village].filter(Boolean).join(", ");
        const postalCode = addr.postcode || "";

        onLocationSelect(detailedAddress || data.display_name, lat, lng, addr, postalCode);
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted, onLocationSelect]);

  // Sync marker when center props change (for external updates)
  useEffect(() => {
    if (mapRef.current && centerLat && centerLng) {
      const latlng = L.latLng(centerLat, centerLng);
      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        markerRef.current = L.marker(latlng).addTo(mapRef.current);
      }
      // Only pan if it's not too far to avoid jumping
      mapRef.current.panTo(latlng);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerLat, centerLng]);

  return (
    <div style={{ position: "relative" }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: "300px", 
          width: "100%", 
          borderRadius: "0.8rem",
          zIndex: 0,
          border: "1px solid rgba(0,0,0,0.06)"
        }} 
      />
      <div style={{ position: "absolute", top: 10, left: 50, zIndex: 1000, background: "rgba(255,255,255,0.9)", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", color: "#333", pointerEvents: "none", fontWeight: 500, border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        Klik di map untuk memilih alamat akurat
      </div>
    </div>
  );
}
