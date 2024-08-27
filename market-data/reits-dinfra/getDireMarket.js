import { fetchData } from "../../utils/template.js";

export async function getDireMarket() {
  const url = "https://www.idx.co.id/primary/EDD/GetDireMarket?start=0&length=9999";
  const referrer = "https://www.idx.co.id/en/market-data/reits-dinfra/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}