import { fetchData } from "../../../utils/template.js";

export async function getNewListing() {
  const url = "https://www.idx.co.id/primary/list/en/market-data/statistical-reports/new-listing-information/?lang=en&start=0&length=9999&year=2024";
  const referrer = "https://www.idx.co.id/en/market-data/statistical-reports/new-listing-information/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}