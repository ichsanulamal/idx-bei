import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the OTC trading report for today.
 * @returns {Promise<string>} - A JSON string of the OTC trading report data for today.
 */
export async function getOtcReport() {
  const baseUrl = "https://www.idx.co.id/secondary/get/otc/lastreport/todayreport";
  const queryParams = new URLSearchParams({
    filter: 'null',
    length: 999999,
    start: 0
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/otc-trading-report/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching OTC trading report:", error.message);
    throw new Error(`Failed to fetch OTC trading report: ${error.message}`);
  }
}
