import { fetchData } from "../../utils/template.js";

/**
 * Retrieves data on the most active contracts from IDX.
 * @returns {Promise<string>} - A JSON string of the most active contracts data.
 */
export async function getMostActiveContract() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetMostActiveContract";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching most active contracts data:", error.message);
    throw new Error(`Failed to fetch most active contracts data: ${error.message}`);
  }
}
