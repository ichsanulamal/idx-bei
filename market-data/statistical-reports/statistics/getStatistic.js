import { fetchData } from "../../../utils/template.js";

export async function getStatistic() {
  const url = "https://www.idx.co.id/primary/Statistic/GetStatistic?year=2024&type=monthly&lang=en";
  const referrer = "https://www.idx.co.id/en/market-data/statistical-reports/statistics/";

  try {
    const res = await fetchData(url, referrer);
    return JSON.stringify(res, null, 2);
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}