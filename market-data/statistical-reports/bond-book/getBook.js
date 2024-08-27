import { fetchData } from "../../../utils/template.js";

export async function getBook() {
  const url = "https://www.idx.co.id/primary/Book/GetBook?type=BondBook&lang=en";
  const referrer = "https://www.idx.co.id/en/market-data/statistical-reports/bond-book/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}
