import { fetchData } from "../../../utils/template.js";

export async function getGovernmentBondIndex() {
  const url = "https://www.idx.co.id/primary/BondSukuk/GetGovernmentBondIndex?length=10&start=1";
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/indobex/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}