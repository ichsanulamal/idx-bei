import { fetchData } from "../../utils/template.js";

/**
 * Retrieves market history data from IDX.
 * @param {string} [date=''] - The date for which to retrieve market history data (format: YYYY-MM-DD).
 * @param {number} [start=0] - The starting index for pagination.
 * @param {number} [length=9999] - The number of records to retrieve.
 * @returns {Promise<string>} - A JSON string of the market history data.
 */
export async function getMarketHistory({
  date = '',
  start = 0,
  length = 9999
} = {}) {
  const baseUrl = "https://www.idx.co.id/primary/DerivativesData/GetMarketHistory";
  const queryParams = new URLSearchParams({ start, length, date }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching market history data:", error.message);
    throw new Error(`Failed to fetch market history data: ${error.message}`);
  }
}
