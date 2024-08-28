import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves government issuer data from IDX.
 * @param {number} [pageSize=1000] - The number of records to retrieve per page.
 * @param {number} [pageNumber=1] - The page number to retrieve.
 * @returns {Promise<string>} - A JSON string of the government issuer data.
 */
export async function getGovIssuer(pageSize = 1000, pageNumber = 1) {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetGovIssuer";
  const queryParams = new URLSearchParams({ pageSize, pageNumber }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/corporate-bonds-sukuk/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching government issuer data:", error.message);
    throw new Error(`Failed to fetch government issuer data: ${error.message}`);
  }
}
