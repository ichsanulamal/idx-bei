import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the PED summary for a specified date from IDX.
 * @param {string} [date=''] - The date for which to retrieve the PED summary (format: YYYYMMDD). Defaults to an empty string.
 * @returns {Promise<string>} - A JSON string of the PED summary data.
 */
export async function getPedSummary(date = '') {
  const baseUrl = "https://www.idx.co.id/primary/TradingSummary/GetPedSummary";
  const queryParams = new URLSearchParams({
    length: 9999,
    start: 0,
    date
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/ped-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching PED summary:", error.message);
    throw new Error(`Failed to fetch PED summary: ${error.message}`);
  }
}
