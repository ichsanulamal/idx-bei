import { fetchData } from "../../utils/template.js";

export async function getFutureToday() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetFutureToday";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}