import { fetchData } from "../../utils/template.js";

/**
 * Fetches data from the IDX API for various endpoints related to exchange members.
 * @param {string} endpoint - The endpoint to retrieve data from.
 * @param {object} [params={}] - Query parameters for the request.
 * @param {string} [referrer='https://www.idx.co.id/en/members-and-participants/exchange-members-profiles/'] - The referrer URL.
 * @returns {Promise<string>} - A JSON string of the response data.
 */
async function fetchFromIDX(endpoint, params = {}, referrer = 'https://www.idx.co.id/en/members-and-participants/exchange-members-profiles/') {
  const baseUrl = `https://www.idx.co.id/primary/ExchangeMember/${endpoint}`;
  const queryParams = new URLSearchParams(params).toString();
  const url = `${baseUrl}?${queryParams}`;
  
  try {
    const response = await fetchData(url, referrer);
    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
}

/**
 * Retrieves broker search data.
 * @returns {Promise<string>} - A JSON string of the broker search data.
 */
export async function getBrokerSearch() {
  return fetchFromIDX('GetBrokerSearch', { option: 0, license: '', start: 0, length: 9999 });
}

/**
 * Retrieves broker details by code.
 * @param {string} code - The broker code.
 * @returns {Promise<string>} - A JSON string of the broker details.
 */
export async function getBrokerDetail(code) {
  return fetchFromIDX('GetBrokerDetail', { code });
}

/**
 * Retrieves MKBD summary by code.
 * @param {string} code - The MKBD code.
 * @returns {Promise<string>} - A JSON string of the MKBD summary.
 */
export async function getMkbdSummary(code) {
  return fetchFromIDX('GetMkbdSummary', { code });
}

/**
 * Retrieves transaction summary by code.
 * @param {string} code - The transaction code.
 * @returns {Promise<string>} - A JSON string of the transaction summary.
 */
export async function getTransactionSummary(code) {
  return fetchFromIDX('GetTransactionSummary', { code });
}

/**
 * Retrieves branch data by code.
 * @param {string} code - The branch code.
 * @param {number} [start=0] - The starting index.
 * @param {number} [length=10] - The number of records to retrieve.
 * @returns {Promise<string>} - A JSON string of the branch data.
 */
export async function getBranch(code, start = 0, length = 10) {
  return fetchFromIDX('GetBranch', { code, start, length });
}
