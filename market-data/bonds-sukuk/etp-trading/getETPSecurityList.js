import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the list of ETP securities from IDX based on the given ticker.
 * @param {string} [ticker=''] - The ticker symbol to filter ETP securities. If empty, retrieves all securities.
 * @returns {Promise<string>} - A JSON string of the ETP securities list.
 */
export async function getETPSecurityList(ticker = '') {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetETPSecurityList";
  const queryParams = new URLSearchParams({
    ticker,
    length: 10,
    start: 0,
    _: Date.now() // Use current timestamp to avoid caching issues
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETP security list:", error.message);
    throw new Error(`Failed to fetch ETP security list: ${error.message}`);
  }
}
