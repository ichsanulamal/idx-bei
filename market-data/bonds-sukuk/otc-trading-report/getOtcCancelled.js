import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the OTC cancelled trading data.
 * @returns {Promise<string>} - A JSON string of the OTC cancelled trading data.
 */
export async function getOtcCancelled() {
  const baseUrl = "https://www.idx.co.id/secondary/get/otc/cancelled";
  const queryParams = new URLSearchParams({
    length: 9999,
    start: 0
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/otc-trading-report/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching OTC cancelled trading data:", error.message);
    throw new Error(`Failed to fetch OTC cancelled trading data: ${error.message}`);
  }
}
