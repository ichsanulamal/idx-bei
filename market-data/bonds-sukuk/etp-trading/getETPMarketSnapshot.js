import { fetchData } from "../../../utils/template.js";

export async function getETPMarketSnapshot(date='20240731') {
  const url = `https://www.idx.co.id/primary/BondSukuk/GetETPMarketSnapshot?date=20240827&start=0&length=10&keyword=`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}