import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the ETP market snapshot from IDX for a specified date.
 * @param {string} [date='20240731'] - The date for which to retrieve the ETP market snapshot (format: YYYYMMDD).
 * @returns {Promise<string>} - A JSON string of the ETP market snapshot data.
 */
export async function getETPMarketSnapshot(date = '20240731') {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetETPMarketSnapshot";
  const queryParams = new URLSearchParams({
    date,
    start: 0,
    length: 10,
    keyword: '',
    _: Date.now() // Use current timestamp to avoid caching issues
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETP market snapshot:", error.message);
    throw new Error(`Failed to fetch ETP market snapshot: ${error.message}`);
  }
}
