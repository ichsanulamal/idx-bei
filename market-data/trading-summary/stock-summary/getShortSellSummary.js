
import { fetchData } from "../../../utils/template.js";

export async function getShortSellSummary(date='') {
  const url = `https://www.idx.co.id/primary/TradingSummary/GetShortSellSummary?length=9999&start=0&date=${date}`;
  const referrer =
    "https://www.idx.co.id/en/market-data/trading-summary/stock-summary/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}