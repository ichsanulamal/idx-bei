import { fetchData } from "../../../utils/template.js";

export async function getIssuerList() {
  const url = "https://www.idx.co.id/primary/StructuredWarrant/GetIssuerList?length=9999&start=0";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/issuer-company-list/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
