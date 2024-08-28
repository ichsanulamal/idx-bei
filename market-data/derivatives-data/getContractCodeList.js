import { fetchData } from "../../utils/template.js";

/**
 * Retrieves the list of contract codes from IDX.
 * @returns {Promise<string>} - A JSON string of the contract code list.
 */
export async function getContractCodeList() {
  const url = "https://www.idx.co.id/primary/DerivativesData/GetContractCodeList";
  const referrer = "https://www.idx.co.id/en/market-data/derivatives-data/futures/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching contract code list:", error.message);
    throw new Error(`Failed to fetch contract code list: ${error.message}`);
  }
}
