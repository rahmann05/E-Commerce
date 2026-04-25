import { NextResponse } from "next/server";

const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY;
const STORE_CITY_ID = "152"; // Default: Jakarta Pusat

// Helper to normalize city names for matching
function normalizeCityName(name: string) {
  return name.toLowerCase()
    .replace("kota ", "")
    .replace("kabupaten ", "")
    .replace("kab. ", "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const { lat, lng, city } = await request.json();
    
    if (!city) {
      return NextResponse.json({ error: "Missing city data" }, { status: 400 });
    }

    if (!RAJAONGKIR_API_KEY) {
      return NextResponse.json({ 
        error: "RAJAONGKIR_API_KEY tidak ditemukan. Tambahkan API Key RajaOngkir Starter di file .env Anda." 
      }, { status: 400 });
    }

    // 1. Get City ID from RajaOngkir
    const cityRes = await fetch("https://api.rajaongkir.com/starter/city", {
      headers: {
        "key": RAJAONGKIR_API_KEY
      }
    });

    const cityData = await cityRes.json();
    if (cityData.rajaongkir.status.code !== 200) {
      return NextResponse.json({ error: cityData.rajaongkir.status.description }, { status: 400 });
    }

    const targetCityName = normalizeCityName(city);
    let destinationCityId = null;

    const cities = cityData.rajaongkir.results;
    for (const c of cities) {
      if (normalizeCityName(c.city_name) === targetCityName) {
        destinationCityId = c.city_id;
        break;
      }
    }

    // If city not found exactly, try partial match
    if (!destinationCityId) {
      for (const c of cities) {
        if (targetCityName.includes(normalizeCityName(c.city_name)) || normalizeCityName(c.city_name).includes(targetCityName)) {
          destinationCityId = c.city_id;
          break;
        }
      }
    }

    if (!destinationCityId) {
      return NextResponse.json({ 
        error: `Kota ${city} tidak ditemukan di database ekspedisi. Pastikan memilih lokasi yang akurat di Peta.` 
      }, { status: 404 });
    }

    // 2. Fetch Costs from multiple couriers (RajaOngkir Starter supports jne, pos, tiki)
    const couriers = ["jne", "tiki", "pos"];
    let availableServices: { id: string; label: string; fee: number; }[] = [];

    for (const courier of couriers) {
      const costRes = await fetch("https://api.rajaongkir.com/starter/cost", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "key": RAJAONGKIR_API_KEY
        },
        body: new URLSearchParams({
          origin: STORE_CITY_ID,
          destination: destinationCityId,
          weight: "1000", // Default 1kg
          courier: courier
        })
      });

      const costData = await costRes.json();
      
      if (costData.rajaongkir.status.code === 200 && costData.rajaongkir.results[0]) {
        const services = costData.rajaongkir.results[0].costs;
        services.forEach((service: any) => {
          if (service.cost && service.cost.length > 0) {
            availableServices.push({
              id: `${courier}-${service.service}`,
              label: `${courier.toUpperCase()} ${service.service} (${service.cost[0].etd} hari)`,
              fee: service.cost[0].value
            });
          }
        });
      }
    }

    if (availableServices.length === 0) {
      return NextResponse.json({ error: "Tidak ada layanan pengiriman yang tersedia ke kota ini." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      couriers: availableServices,
      city: city,
      mapped_city_id: destinationCityId
    });

  } catch (error: any) {
    console.error("Shipping API error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
