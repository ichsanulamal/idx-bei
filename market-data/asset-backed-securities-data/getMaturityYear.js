import { fetchData } from "../../utils/template.js";

/**
 * Retrieves maturity year data from IDX.
 * @returns {Promise<string>} - A JSON string of the maturity year data.
 */
export async function getMaturityYear() {
  const url = "https://www.idx.co.id/primary/Helper/GetMaturityYear";
  const referrer = "https://www.idx.co.id/en/market-data/asset-backed-securities-data/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching maturity year data:", error.message);
    throw new Error(`Failed to fetch maturity year data: ${error.message}`);
  }
}
