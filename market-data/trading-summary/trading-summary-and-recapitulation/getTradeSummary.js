import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the trade summary from IDX.
 * @returns {Promise<string>} - A JSON string of the trade summary data.
 */
export async function getTradeSummary() {
  const baseUrl = "https://www.idx.co.id/primary/Home/GetTradeSummary";
  const queryParams = new URLSearchParams({
    lang: 'en'
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/trading-summary-and-recapitulation/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching trade summary:", error.message);
    throw new Error(`Failed to fetch trade summary: ${error.message}`);
  }
}
