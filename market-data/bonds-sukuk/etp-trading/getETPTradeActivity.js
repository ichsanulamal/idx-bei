import { fetchData } from "../../../utils/template.js";

export async function getETPTradeActivity(date='20240731') {
  const url = `https://www.idx.co.id/primary/BondSukuk/GetETPTradeActivity?length=10&start=0&date=${date}&_=1724761584820`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}