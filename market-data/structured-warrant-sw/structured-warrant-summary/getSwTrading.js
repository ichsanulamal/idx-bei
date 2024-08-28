import { fetchData } from "../../../utils/template.js";

/**
 * Retrieves structured warrant trading data from IDX.
 * @param {number} [length=9999] - The number of records to retrieve.
 * @param {string} [issuer=''] - The issuer filter for the structured warrants.
 * @param {string} [swType=''] - The structured warrant type filter.
 * @param {number} [start=0] - The starting index for pagination.
 * @param {string} [dateFrom='1901-01-01'] - The start date for the trading data.
 * @param {string} [dateTo='2024-08-27'] - The end date for the trading data.
 * @returns {Promise<string>} - A JSON string of the structured warrant trading data.
 */
export async function getSwTrading({
  length = 9999,
  issuer = '',
  swType = '',
  start = 0,
  dateFrom = '',
  dateTo = ''} = {}) {
  const baseUrl = "https://www.idx.co.id/secondary/get/StructuredWarrant/Trading";
  const queryParams = new URLSearchParams({
    length,
    issuer,
    SW: swType,
    start,
    datefrom: dateFrom,
    dateto: dateTo
  }).toString();
  const url = `${baseUrl}?${queryParams}`;
  const referrer = "https://www.idx.co.id/en/market-data/structured-warrant-sw/structured-warrant-summary/";

  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response["Results"], null, 2);
  } catch (error) {
    console.error("Error fetching structured warrant trading data:", error.message);
    throw new Error(`Failed to fetch structured warrant trading data: ${error.message}`);
  }
}
