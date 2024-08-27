import { fetchData } from "../../../utils/template.js";

export async function getTradeSummary() {
  const url = "https://www.idx.co.id/primary/Home/GetTradeSummary?lang=en";
  const referrer =
    "https://www.idx.co.id/en/market-data/trading-summary/trading-summary-and-recapitulation/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
