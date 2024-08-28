import { fetchData } from "../../utils/template.js";

/**
 * Retrieves the DIRE market data from IDX.
 * @param {number} [start=0] - The starting index for pagination.
 * @param {number} [length=9999] - The number of records to retrieve.
 * @returns {Promise<string>} - A JSON string of the DIRE market data.
 */
export async function getDireMarket({
  start = 0,
  length = 9999
} = {}) {
  const baseUrl = "https://www.idx.co.id/primary/EDD/GetDireMarket";
  const queryParams = new URLSearchParams({ start, length }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/reits-dinfra/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching DIRE market data:", error.message);
    throw new Error(`Failed to fetch DIRE market data: ${error.message}`);
  }
}
