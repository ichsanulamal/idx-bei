import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the broker summary for a specified date from IDX.
 * @param {string} [date=''] - The date for which to retrieve the broker summary (format: YYYYMMDD).
 * @returns {Promise<string>} - A JSON string of the broker summary data.
 */
export async function getBrokerSummary(date = '') {
  const baseUrl = "https://www.idx.co.id/primary/TradingSummary/GetBrokerSummary";
  const queryParams = new URLSearchParams({
    length: 9999,
    start: 0,
    date
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/broker-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching broker summary:", error.message);
    throw new Error(`Failed to fetch broker summary: ${error.message}`);
  }
}
