import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the OTC corrected trading data.
 * @returns {Promise<string>} - A JSON string of the OTC corrected trading data.
 */
export async function getOtcCorrected() {
  const baseUrl = "https://www.idx.co.id/secondary/get/otc/corrected";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/otc-trading-report/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching OTC corrected trading data:", error.message);
    throw new Error(`Failed to fetch OTC corrected trading data: ${error.message}`);
  }
}
