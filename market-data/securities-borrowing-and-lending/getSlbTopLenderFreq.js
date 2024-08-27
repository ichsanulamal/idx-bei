import { fetchData } from "../../utils/template.js";

export async function getSlbTopLenderFreq() {
  const url = "https://www.idx.co.id/primary/Slb/TopLenderFreq";
  const referrer = "https://www.idx.co.id/en/market-data/securities-borrowing-and-lending/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
