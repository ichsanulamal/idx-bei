import { fetchData } from "../../utils/template.js";

export async function getAbsSearchTable(bondId='', yearMatured='') {
  const url = `https://www.idx.co.id/primary/MarketData/GetAbsSearchTable?draw=1&start=0&length=9999`;
  // &yearMatured=${yearMatured}&bondId=${bondId}
  const referrer = "https://www.idx.co.id/en/market-data/asset-backed-securities-data/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}