import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the structured warrant issuers dropdown list from IDX.
 * @returns {Promise<string>} - A JSON string of the issuer dropdown list.
 */
export async function getIssuerDDL() {
  const url = "https://www.idx.co.id/primary/StructuredWarrant/GetIssuerDDL";
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-information/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching issuer dropdown list:", error.message);
    throw new Error(`Failed to fetch issuer dropdown list: ${error.message}`);
  }
}
