import { fetchData } from "../../../utils/template.js";

export async function getOtcTrade() {
  const url = `https://www.idx.co.id/secondary/get/otc/lastreport/todaytrade?filter=null&length=999999&start=0`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/otc-trading-report/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}