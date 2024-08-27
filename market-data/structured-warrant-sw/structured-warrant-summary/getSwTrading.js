import { fetchData } from "../../../utils/template.js";

export async function getSwTrading() {
  const url = "https://www.idx.co.id/secondary/get/StructuredWarrant/Trading?length=9999&issuer=&SW=&start=0&datefrom=1901-01-01&dateto=2024-08-27";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-summary/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}