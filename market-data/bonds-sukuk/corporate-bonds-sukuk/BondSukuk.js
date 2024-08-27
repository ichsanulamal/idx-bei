import fs from "fs";

import { fetchData } from '../../../utils/template.js';

// Helper function to build the fetch URL
function buildFetchUrl(pageSize, indexFrom, bondType) {
  return `https://www.idx.co.id/secondary/get/BondSukuk/bond?pageSize=${pageSize}&indexFrom=${indexFrom}&bondType=${bondType}`;
}

const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/corporate-bonds-sukuk/";

// Main function to fetch bond data with pagination
export async function BondSukuk(pageSize = 100, indexFrom = 1, bondType = 2) {
  const allResults = [];

  try {
    const initialUrl = buildFetchUrl(pageSize, indexFrom, bondType);
    const initialData = await fetchData(initialUrl, referrer);

    const totalResultCount = initialData.ResultCount;
    const totalPages = Math.ceil(totalResultCount / pageSize);

    while (indexFrom <= totalPages) {
      console.log(indexFrom);

      const url = buildFetchUrl(pageSize, indexFrom, bondType);
      const data = await fetchData(url, referrer);

      console.log(data.Results);
      allResults.push(...data.Results);

      indexFrom += 1; // Move to the next page
    }

    return JSON.stringify(allResults, null, 2);

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}
