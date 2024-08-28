import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the list of instruments from IDX.
 * @returns {Promise<string>} - A JSON string of the instrument list data.
 */
export async function getInstrumentList() {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetInstrumentList";
  const queryParams = new URLSearchParams({}).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/pds-quotation/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching instrument list:", error.message);
    throw new Error(`Failed to fetch instrument list: ${error.message}`);
  }
}
