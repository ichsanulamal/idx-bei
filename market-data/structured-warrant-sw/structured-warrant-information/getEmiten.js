import { fetchData } from "../../../utils/template.js";

export async function getEmiten() {
  const url = "https://www.idx.co.id/primary/Helper/GetEmiten?emitenType=s";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}