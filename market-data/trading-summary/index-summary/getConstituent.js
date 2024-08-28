import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the constituent data for IDX.
 * @returns {Promise<string>} - A JSON string of the constituent data.
 */
export async function getConstituent() {
  const baseUrl = "https://www.idx.co.id/primary/StockData/GetConstituent";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/trading-summary/index-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching constituent data:", error.message);
    throw new Error(`Failed to fetch constituent data: ${error.message}`);
  }
}
