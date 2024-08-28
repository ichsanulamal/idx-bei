import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the index group prevalues from IDX.
 * @returns {Promise<string>} - A JSON string of the index group prevalues data.
 */
export async function getIndexGroupPrevalues() {
  const baseUrl = "https://www.idx.co.id/primary/StockData/GetIndexGroupPrevalues";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/stocks-data/stock-index/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching index group prevalues:", error.message);
    throw new Error(`Failed to fetch index group prevalues: ${error.message}`);
  }
}
