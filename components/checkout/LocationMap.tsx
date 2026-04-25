"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationMapProps {
  onLocationSelect: (address: string, lat: number, lng: number, city: string) => void;
  centerLat?: number | null;
  centerLng?: number | null;
}

function MapUpdater({ lat, lng }: { lat?: number | null, lng?: number | null }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

function LocationMarker({ onLocationSelect }: LocationMapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await response.json();
        if (data && data.display_name) {
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown";
          onLocationSelect(data.display_name, e.latlng.lat, e.latlng.lng, city);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function LocationMap({ onLocationSelect, centerLat, centerLng }: LocationMapProps) {
  return (
    <div style={{ height: "300px", width: "100%", borderRadius: "0.8rem", overflow: "hidden", zIndex: 0, position: "relative", border: "1px solid rgba(0,0,0,0.06)" }}>
      <MapContainer
        center={[-6.200000, 106.816666]} // Default to Jakarta
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
        <MapUpdater lat={centerLat} lng={centerLng} />
      </MapContainer>
      <div style={{ position: "absolute", top: 10, left: 50, zIndex: 1000, background: "rgba(255,255,255,0.9)", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", color: "#333", pointerEvents: "none", fontWeight: 500, border: "1px solid rgba(0,0,0,0.1)" }}>
        Klik di map untuk memilih alamat akurat
      </div>
    </div>
  );
}
