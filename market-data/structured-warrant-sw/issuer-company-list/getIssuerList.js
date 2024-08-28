import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the list of issuers from IDX.
 * @param {number} [length=9999] - The number of issuers to retrieve.
 * @param {number} [start=0] - The starting index for pagination.
 * @returns {Promise<string>} - A JSON string of the issuer list.
 */
export async function getIssuerList(length = 9999, start = 0) {
  const baseUrl = "https://www.idx.co.id/primary/StructuredWarrant/GetIssuerList";
  const queryParams = new URLSearchParams({ length, start }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/issuer-company-list/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching issuer list:", error.message);
    throw new Error(`Failed to fetch issuer list: ${error.message}`);
  }
}
