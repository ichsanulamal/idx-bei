import { fetchData } from "../../../utils/template.js";

export async function getBoards() {
  const url = "https://www.idx.co.id/primary/Helper/GetBoards?language=en-us";
  const referrer = "https://www.idx.co.id/en/market-data/stocks-data/stock-list/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
