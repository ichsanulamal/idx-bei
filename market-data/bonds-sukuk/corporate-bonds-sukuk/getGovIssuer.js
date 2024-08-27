import { fetchData } from "../../../utils/template.js";

export async function getGovIssuer() {
  const url = "https://www.idx.co.id/primary/BondSukuk/GetGovIssuer?pageSize=1000&pageNumber=1";
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/corporate-bonds-sukuk/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}