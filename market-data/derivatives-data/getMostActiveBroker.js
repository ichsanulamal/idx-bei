import { fetchData } from "../../utils/template.js";

/**
 * Retrieves data on the most active brokers from IDX.
 * @returns {Promise<string>} - A JSON string of the most active brokers data.
 */
export async function getMostActiveBroker() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetMostActiveBroker";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching most active brokers data:", error.message);
    throw new Error(`Failed to fetch most active brokers data: ${error.message}`);
  }
}
