import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the Corporate Bond Index data from IDX.
 * @param {number} [length=10] - The number of records to retrieve.
 * @param {number} [start=1] - The starting index for the records.
 * @returns {Promise<string>} - A JSON string of the Corporate Bond Index data.
 */
export async function getCorporateBondIndex(length = 10, start = 1) {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetCorporateBondIndex";
  const queryParams = new URLSearchParams({ length, start }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/indobex/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching Corporate Bond Index data:", error.message);
    throw new Error(`Failed to fetch Corporate Bond Index data: ${error.message}`);
  }
}
