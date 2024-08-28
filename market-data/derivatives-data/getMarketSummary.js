import { fetchData } from "../../utils/template.js";

/**
 * Retrieves market summary data from IDX.
 * @returns {Promise<string>} - A JSON string of the market summary data.
 */
export async function getMarketSummary() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetMarketSummary";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching market summary data:", error.message);
    throw new Error(`Failed to fetch market summary data: ${error.message}`);
  }
}
