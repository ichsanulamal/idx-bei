import { fetchData } from "../../../utils/template.js";

export async function getETPDailySummary(date='20240731') {
  const url = `https://www.idx.co.id/primary/BondSukuk/GetETPDailySummary?start=0&length=10&keyword=&date=20240827&_=1724761641023`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}