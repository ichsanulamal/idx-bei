import { fetchData } from "../../../utils/template.js";

export async function getPdQuotationReference(instrument='FR0097') {
  const url = `https://www.idx.co.id/primary/BondSukuk/GetPdQuotationReference?Instrument=${instrument}`;
  const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/pds-quotation/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}

