import { fetchData } from "../../../utils/template.js";

export async function getFactSheetIndex() {
  const url = "https://www.idx.co.id/primary/StockData/GetFactSheetIndex?year=2024&lang=en";
  const referrer = "https://www.idx.co.id/en/market-data/statistical-reports/fact-sheet-index/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}