import { fetchData } from "../../utils/template.js";

/**
 * Retrieves ETF market data from IDX.
 * @param {number} [length=9999] - The number of records to retrieve.
 * @returns {Promise<string>} - A JSON string of the ETF market data.
 */
export async function getEtfMarket({
  length = 9999
} = {}) {
  const baseUrl = "https://www.idx.co.id/primary/EDD/GetEtfMarket";
  const queryParams = new URLSearchParams({ length }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/exchanged-traded-fund-etf-data/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETF market data:", error.message);
    throw new Error(`Failed to fetch ETF market data: ${error.message}`);
  }
}
