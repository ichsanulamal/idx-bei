import { fetchData } from "../../utils/template.js";

export async function getAbs() {
  const url = "https://www.idx.co.id/primary/MarketData/GetAbs";
  const referrer = "https://www.idx.co.id/en/market-data/asset-backed-securities-data/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}