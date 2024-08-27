import { fetchData } from "../../../utils/template.js";

export async function getPerfSumLq45Company() {
  const url = "https://www.idx.co.id/primary/StockData/GetPerfSumLq45Company?length=10&start=0&year=2024&lang=en";
  const referrer = "https://www.idx.co.id/en/market-data/statistical-reports/company-fact-sheet-lq45";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}