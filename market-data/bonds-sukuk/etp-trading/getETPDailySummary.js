import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the ETP daily summary from IDX for a specified date.
 * @param {string} [date='20240731'] - The date for which to retrieve the ETP daily summary (format: YYYYMMDD).
 * @returns {Promise<string>} - A JSON string of the ETP daily summary data.
 */
export async function getETPDailySummary(date = '20240731') {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetETPDailySummary";
  const queryParams = new URLSearchParams({
    start: 0,
    length: 10,
    keyword: '',
    date,
    _: Date.now() // Use current timestamp to avoid caching issues
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETP daily summary:", error.message);
    throw new Error(`Failed to fetch ETP daily summary: ${error.message}`);
  }
}
