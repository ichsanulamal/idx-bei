import { fetchData } from "../../../utils/template.js";

export async function getIssuerDDL() {
  const url = "https://www.idx.co.id/primary/StructuredWarrant/GetIssuerDDL";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
