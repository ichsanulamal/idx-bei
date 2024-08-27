import { fetchData } from "../../../utils/template.js";

export async function getStockUploader(typeIndex='', year='') {
  const url = `https://www.idx.co.id/secondary/get/StockData/GetStockUploader?typeIndex=${typeIndex}&year=${year}&table=stockIndex&locale=en`;
  const referrer = "https://www.idx.co.id/en/market-data/stocks-data/stock-index/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
