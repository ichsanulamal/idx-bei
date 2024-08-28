import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the structured warrant types from IDX.
 * @returns {Promise<string>} - A JSON string of the structured warrant types.
 */
export async function getSwTypes() {
  const url = "https://www.idx.co.id/primary/StructuredWarrant/GetSwTypes";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching structured warrant types:", error.message);
    throw new Error(`Failed to fetch structured warrant types: ${error.message}`);
  }
}
