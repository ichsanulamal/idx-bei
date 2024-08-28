import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the recap summary from IDX.
 * @returns {Promise<string>} - A JSON string of the recap summary data.
 */
export async function getRecapSummary() {
  const baseUrl = "https://www.idx.co.id/primary/TradingSummary/GetRecapSummary";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/trading-summary-and-recapitulation/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching recap summary:", error.message);
    throw new Error(`Failed to fetch recap summary: ${error.message}`);
  }
}
