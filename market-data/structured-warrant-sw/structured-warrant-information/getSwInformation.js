import { fetchData } from "../../../utils/template.js";

export async function getSwInformation() {
  const url = "https://www.idx.co.id/secondary/get/StructuredWarrant/Information?length=9999&issuer=&swType=&start=0";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}