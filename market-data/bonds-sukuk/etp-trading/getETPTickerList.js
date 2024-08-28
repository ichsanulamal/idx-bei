import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the list of ETP tickers from IDX.
 * @returns {Promise<string>} - A JSON string of the ETP tickers list.
 */
export async function getETPTickerList() {
  const url = "https://www.idx.co.id/primary/BondSukuk/GetETPTickerList";
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/etp-trading/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching ETP ticker list:", error.message);
    throw new Error(`Failed to fetch ETP ticker list: ${error.message}`);
  }
}
