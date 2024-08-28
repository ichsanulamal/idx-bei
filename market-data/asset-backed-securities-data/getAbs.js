import { fetchData } from "../../utils/template.js";

/**
 * Retrieves Asset-Backed Securities (ABS) data from IDX.
 * @returns {Promise<string>} - A JSON string of the ABS data.
 */
export async function getAbs() {
  const url = "https://www.idx.co.id/primary/MarketData/GetAbs";
  const referrer = "https://www.idx.co.id/en/market-data/asset-backed-securities-data/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ABS data:", error.message);
    throw new Error(`Failed to fetch ABS data: ${error.message}`);
  }
}
