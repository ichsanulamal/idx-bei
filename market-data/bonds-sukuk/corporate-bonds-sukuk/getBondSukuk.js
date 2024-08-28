import fs from "fs";
import { fetchData } from '../../../utils/template.js';

const pageSize = 100;

/**
 * Builds the fetch URL for bond data.
 * @param {number} indexFrom - The starting index for pagination.
 * @param {number} bondType - The type of bond (1 for corporate, 2 for government).
 * @param {number} instrumentId - The instrument ID (0 for all, 1 for obligation, 2 for sukuk).
 * @returns {string} - The URL for fetching bond data.
 */
function buildFetchUrl(indexFrom, bondType, instrumentId) {
  return `https://www.idx.co.id/secondary/get/BondSukuk/bond?pageSize=${pageSize}&indexFrom=${indexFrom}&bondType=${bondType}&instrumentId=${instrumentId}`;
}

const referrer = "https://www.idx.co.id/en/market-data/bonds-sukuk/corporate-bonds-sukuk/";

/**
 * Fetches bond data with pagination.
 * @param {number} [indexFrom=1] - The starting index for pagination.
 * @param {number} [bondType=2] - The type of bond (1 for corporate, 2 for government).
 * @param {number} [instrumentId=0] - The instrument ID (0 for all, 1 for obligation, 2 for sukuk).
 * @returns {Promise<string>} - A JSON string of all fetched bond data.
 */
export async function getBondSukuk(indexFrom = 1, bondType = 2, instrumentId = 0) {
  const allResults = [];

  try {
    const initialUrl = buildFetchUrl(indexFrom, bondType, instrumentId);
    const initialData = await fetchData(initialUrl, referrer);

    const totalResultCount = initialData.ResultCount;
    const totalPages = Math.ceil(totalResultCount / pageSize);

    while (indexFrom <= totalPages) {
      console.log(`Fetching page ${indexFrom} of ${totalPages}`);

      const url = buildFetchUrl(indexFrom, bondType, instrumentId);
      const data = await fetchData(url, referrer);

      console.log(`Fetched ${data.Results.length} results from page ${indexFrom}`);
      allResults.push(...data.Results);

      indexFrom += 1; // Move to the next page
    }

    return JSON.stringify(allResults, null, 2);

  } catch (error) {
    console.error('Error fetching bond data:', error.message);
    throw new Error(`Failed to fetch bond data: ${error.message}`);
  }
}
