  import { fetchData } from "../../../utils/template.js";

  export async function getIndexIC() {
    const url = "https://www.idx.co.id/primary/StockData/GetIndexIC";
    const referrer =
      "https://www.idx.co.id/en/market-data/trading-summary/index-summary/";
  
    try {
      const res = await fetchData(url, referrer);
      return JSON.stringify(res, null, 2);
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  }