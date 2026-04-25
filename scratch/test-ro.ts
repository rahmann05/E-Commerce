import "dotenv/config";

async function testRajaOngkir() {
  const key = process.env.RAJAONGKIR_API_KEY;
  console.log("Using Key:", key ? `${key.substring(0, 5)}...` : "NOT FOUND");

  try {
    const res = await fetch("https://api.rajaongkir.com/starter/city", {
      headers: {
        "key": key || ""
      }
    });

    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    
    const text = await res.text();
    console.log("Raw Response:");
    console.log(text.substring(0, 500)); // Print first 500 chars

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testRajaOngkir();
