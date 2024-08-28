import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves ETP trade activity data from IDX for a specified date.
 * @param {string} [date='20240731'] - The date for which to retrieve ETP trade activity (format: YYYYMMDD).
 * @returns {Promise<string>} - A JSON string of the ETP trade activity data.
 */
export async function getETPTradeActivity(date = '20240731') {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetETPTradeActivity";
  const queryParams = new URLSearchParams({
    length: 10,
    start: 0,
    date,
    _: Date.now() // Use current timestamp to avoid caching issues
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETP trade activity:", error.message);
    throw new Error(`Failed to fetch ETP trade activity: ${error.message}`);
  }
}
