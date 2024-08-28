import { fetchData } from "../../utils/template.js";

/**
 * Retrieves ABS search table data from IDX with optional filters.
 * @param {string} [bondId=''] - The bond ID to filter the search results.
 * @param {string} [yearMatured=''] - The year of maturity to filter the search results.
 * @returns {Promise<string>} - A JSON string of the ABS search table data.
 */
export async function getAbsSearchTable() {
  const baseUrl = "https://www.idx.co.id/primary/MarketData/GetAbsSearchTable";
  const queryParams = new URLSearchParams({
    draw: 1,
    start: 0,
    length: 9999
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/asset-backed-securities-data/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response['data'], null, 2);
  } catch (error) {
    console.error("Error fetching ABS search table data:", error.message);
    throw new Error(`Failed to fetch ABS search table data: ${error.message}`);
  }
}
