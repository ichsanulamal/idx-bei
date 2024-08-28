import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the stock summary for a specified date from IDX.
 * @param {string} [date=''] - The date for which to retrieve the stock summary (format: YYYYMMDD). Defaults to an empty string.
 * @returns {Promise<string>} - A JSON string of the stock summary data.
 */
export async function getStockSummary(date = '') {
  const baseUrl = "https://www.idx.co.id/primary/TradingSummary/GetStockSummary";
  const queryParams = new URLSearchParams({
    length: 9999,
    start: 0,
    date
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/stock-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching stock summary:", error.message);
    throw new Error(`Failed to fetch stock summary: ${error.message}`);
  }
}
