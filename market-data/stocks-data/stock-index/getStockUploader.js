import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves stock uploader data from IDX based on the specified parameters.
 * @param {string} [typeIndex=''] - The type of index to retrieve data for (e.g., 'stockIndex', 'preOpeningStocks', 'marginStocks').
 * @param {string} [year=''] - The year for which to retrieve data.
 * @param {string} [tableIndex='stockIndex'] - The table index to specify which data to retrieve (default is 'stockIndex').
 * @returns {Promise<string>} - A JSON string of the stock uploader data.
 */
export async function getStockUploader(typeIndex = '', year = '', tableIndex = 'stockIndex') {
  const baseUrl = "https://www.idx.co.id/secondary/get/StockData/GetStockUploader";
  const queryParams = new URLSearchParams({
    typeIndex,
    year,
    table: tableIndex,
    locale: 'en'
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/stocks-data/stock-index/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching stock uploader data:", error.message);
    throw new Error(`Failed to fetch stock uploader data: ${error.message}`);
  }
}
