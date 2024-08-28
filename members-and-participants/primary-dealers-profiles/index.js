import { fetchData } from "../../utils/template.js";

/**
 * Fetches data from the IDX API for various participant-related endpoints.
 * @param {string} endpoint - The endpoint to retrieve data from.
 * @param {object} [params={}] - Query parameters for the request.
 * @param {string} [referrer='https://www.idx.co.id/en/members-and-participants/participants-profiles/'] - The referrer URL.
 * @returns {Promise<string>} - A JSON string of the response data.
 */
async function fetchFromIDX(endpoint, params = {}, referrer = 'https://www.idx.co.id/en/members-and-participants/participants-profiles/') {
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
 * Retrieves participant search data.
 * @returns {Promise<string>} - A JSON string of the participant search data.
 */
export async function getParticipantSearch() {
  return fetchFromIDX('GetParticipantSearch', { draw: 1, start: 0, length: 9999, licenseType: 'All' });
}

/**
 * Retrieves participant details by code.
 * @param {string} code - The participant code.
 * @returns {Promise<string>} - A JSON string of the participant details.
 */
export async function getParticipantDetail(code) {
  return fetchFromIDX('GetParticipantDetail', { code });
}
