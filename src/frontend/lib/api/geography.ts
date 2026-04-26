const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export async function fetchProvinces() {
  const res = await fetch(`${BASE_URL}/provinces.json`);
  return res.json();
}

export async function fetchRegencies(provinceId: string) {
  const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
  return res.json();
}

export async function fetchDistricts(regencyId: string) {
  const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
  return res.json();
}

export async function fetchVillages(districtId: string) {
  const res = await fetch(`${BASE_URL}/villages/${districtId}.json`);
  return res.json();
}
