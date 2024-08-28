import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the index summary for a specified date from IDX.
 * @param {string} date - The date for which to retrieve the index summary (format: YYYYMMDD).
 * @returns {Promise<string>} - A JSON string of the index summary data.
 */
export async function getIndexSummary(date) {
  const baseUrl = "https://www.idx.co.id/primary/TradingSummary/GetIndexSummary";
  const queryParams = new URLSearchParams({
    date,
    length: 9999,
    start: 0
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/index-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching index summary:", error.message);
    throw new Error(`Failed to fetch index summary: ${error.message}`);
  }
}
