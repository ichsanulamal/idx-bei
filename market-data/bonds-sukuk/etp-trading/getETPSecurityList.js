import { fetchData } from "../../../utils/template.js";

export async function getETPSecurityList(ticker='') {
  const url = `https://www.idx.co.id/primary/BondSukuk/GetETPSecurityList?ticker=${ticker}&length=10&start=0`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
