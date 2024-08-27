import { fetchData } from "../../../utils/template.js";

export async function getSecuritiesStock(code='', sector='', board='') {
  const url = `https://www.idx.co.id/primary/StockData/GetSecuritiesStock?start=0&length=9999&code=${encodeURIComponent(code)}&sector=${encodeURIComponent(sector)}&board=${encodeURIComponent(board)}&language=en-us`;
  const referrer = "https://www.idx.co.id/en/market-data/stocks-data/stock-list/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
