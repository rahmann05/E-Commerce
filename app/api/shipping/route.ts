import { NextResponse } from "next/server";

// Store location (Jakarta Pusat)
const STORE_LAT = -6.1805;
const STORE_LNG = 106.8284;

// Haversine formula to calculate distance between two coordinates in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function POST(request: Request) {
  try {
    const { lat, lng, city } = await request.json();
    
    if (!lat || !lng) {
      return NextResponse.json({ error: "Koordinat lokasi tidak lengkap. Pastikan alamat dipilih dari Map." }, { status: 400 });
    }

    // Calculate real distance using coordinates
    const distanceKm = calculateDistance(STORE_LAT, STORE_LNG, lat, lng);
    
    // Simulate highly realistic shipping calculation based on distance 
    const baseJNE = 10000;
    const rateJNE = 4500; // Rp 4.500 per KM untuk luar kota (base)
    
    const baseSiCepat = 12000;
    const rateSiCepat = 5500;

    let feeJNE = Math.max(baseJNE, Math.floor(distanceKm * rateJNE));
    let feeSiCepat = Math.max(baseSiCepat, Math.floor(distanceKm * rateSiCepat));

    // Caps & Adjustments for realism (e.g. crossing provinces shouldn't cost millions per kg)
    if (distanceKm > 50) {
       feeJNE = 15000 + Math.floor((distanceKm - 50) * 150); // Flat rate for long distance + small increment
       feeSiCepat = 18000 + Math.floor((distanceKm - 50) * 180);
    }
    
    if (distanceKm > 500) {
      feeJNE = Math.min(feeJNE, 85000); // Cap max shipping to realistic values
      feeSiCepat = Math.min(feeSiCepat, 95000);
    }

    // Round to nearest thousands
    feeJNE = Math.round(feeJNE / 1000) * 1000;
    feeSiCepat = Math.round(feeSiCepat / 1000) * 1000;

    const couriers = [
      { id: "jne-reg", label: "JNE Reguler (2-4 hari)", fee: feeJNE },
      { id: "sicepat-best", label: "SiCepat BEST (1-2 hari)", fee: feeSiCepat },
    ];

    // Same Day Delivery Logic (Only if distance is < 40 km from store)
    if (distanceKm < 40) {
      const feeGojek = Math.max(15000, Math.round((distanceKm * 2500) / 1000) * 1000);
      couriers.unshift({ id: "gojek-sameday", label: "Gojek Same Day", fee: feeGojek });
    }

    return NextResponse.json({
      success: true,
      distance_km: Number(distanceKm.toFixed(1)),
      couriers,
      city
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Shipping API error:", msg);
    return NextResponse.json({ error: "Sistem Ekspedisi Gagal", details: msg }, { status: 500 });
  }
}
