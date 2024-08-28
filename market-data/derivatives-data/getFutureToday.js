import { fetchData } from "../../utils/template.js";

/**
 * Retrieves today's futures data from IDX.
 * @returns {Promise<string>} - A JSON string of today's futures data.
 */
export async function getFutureToday() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetFutureToday";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching today's futures data:", error.message);
    throw new Error(`Failed to fetch today's futures data: ${error.message}`);
  }
}
