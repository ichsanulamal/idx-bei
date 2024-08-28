import { fetchData } from "../../utils/template.js";

/**
 * Retrieves futures chart data from IDX.
 * @param {string} [period='1Y'] - The period for the chart data (e.g., '1Y' for one year).
 * @param {string} [contractCode='BM10Z2'] - The contract code for the futures chart.
 * @returns {Promise<string>} - A JSON string of the futures chart data.
 */
export async function getFuturesChart({
  period = '1Y',
  contractCode = 'BM10Z2'
} = {}) {
  const baseUrl = "https://www.idx.co.id/primary/DerivativesData/GetFuturesChart";
  const queryParams = new URLSearchParams({ period, contractCode }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching futures chart data:", error.message);
    throw new Error(`Failed to fetch futures chart data: ${error.message}`);
  }
}
