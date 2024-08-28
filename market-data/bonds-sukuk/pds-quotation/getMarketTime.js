import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the current market time from IDX.
 * @returns {Promise<string>} - A JSON string of the market time data.
 */
export async function getMarketTime() {
  const baseUrl = "https://www.idx.co.id/primary/Helper/GetMarketTime";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/pds-quotation/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching market time:", error.message);
    throw new Error(`Failed to fetch market time: ${error.message}`);
  }
}
