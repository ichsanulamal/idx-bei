import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the list of emitters from IDX.
 * @param {string} emitenType - The type of emitters to retrieve (e.g., 's' for structured warrants).
 * @returns {Promise<string>} - A JSON string of the emitters list.
 */
export async function getEmiten(emitenType = '') {
  const url = `https://www.idx.co.id/primary/Helper/GetEmiten?emitenType=${encodeURIComponent(emitenType)}`;
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching emitters:", error.message);
    throw new Error(`Failed to fetch emitters: ${error.message}`);
  }
}
