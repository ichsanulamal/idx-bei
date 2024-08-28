import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves structured warrant information from IDX.
 * @param {string} underlying - The underlying asset.
 * @param {string} issuer - The issuer of the structured warrant.
 * @param {string} swType - The type of structured warrant (e.g., 'call', 'put').
 * @returns {Promise<string>} - A JSON string of the structured warrant information.
 */
export async function getSwInformation(underlying='', issuer='', swType='') {
  const baseUrl = "https://www.idx.co.id/secondary/get/StructuredWarrant/Information";
  const params = new URLSearchParams({
    length: '9999',
    underlying,
    issuer,
    swType,
    start: '0'
  }).toString();

  const url = `${baseUrl}?${params}`;
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching structured warrant information:", error);
    throw new Error(`Failed to fetch structured warrant information: ${error.message}`);
  }
}
