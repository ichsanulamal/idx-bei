import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the Composite Bond Index data from IDX.
 * @returns {Promise<string>} - A JSON string of the Composite Bond Index data.
 */
export async function getCompositeBondIndex() {
  const url = "https://www.idx.co.id/primary/BondSukuk/GetCompositeBondIndex";
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/indobex/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching Composite Bond Index data:", error.message);
    throw new Error(`Failed to fetch Composite Bond Index data: ${error.message}`);
  }
}
