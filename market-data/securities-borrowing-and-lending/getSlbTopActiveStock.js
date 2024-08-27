import { fetchData } from "../../utils/template.js";

export async function getSlbTopActiveStock() {
  const url = "https://www.idx.co.id/primary/Slb/TopActiveStock";
  const referrer = "https://www.idx.co.id/en/market-data/securities-borrowing-and-lending/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}