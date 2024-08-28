import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves the PD quotation reference for a specified instrument from IDX.
 * @param {string} [instrument='FR0097'] - The instrument code to retrieve the PD quotation reference for.
 * @returns {Promise<string>} - A JSON string of the PD quotation reference data.
 */
export async function getPdQuotationReference(instrument = 'FR0097') {
  const baseUrl = "https://www.idx.co.id/primary/BondSukuk/GetPdQuotationReference";
  const queryParams = new URLSearchParams({
    Instrument: instrument
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/pds-quotation/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error fetching PD quotation reference:", error.message);
    throw new Error(`Failed to fetch PD quotation reference: ${error.message}`);
  }
}
