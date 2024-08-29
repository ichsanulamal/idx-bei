import { fetchData } from "../../../utils/template.js";

/**
 * Fetches data from the IDX API for news announcements and SPPA profiles.
 * @param {string} endpoint - The endpoint to retrieve data from.
 * @param {object} [params={}] - Query parameters for the request.
 * @param {string} [referrer='https://www.idx.co.id/en/members-and-participants/indonesia-alternative-market-trading-system-user-profile/'] - The referrer URL.
 * @returns {Promise<string>} - A JSON string of the response data.
 */
async function fetchFromIDX(endpoint, params = {}, referrer = 'https://www.idx.co.id/en/members-and-participants/indonesia-alternative-market-trading-system-user-profile/') {
  const baseUrl = `https://www.idx.co.id/primary/NewsAnnouncement/${endpoint}`;
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
 * Retrieves SPPA profile data.
 * @returns {Promise<string>} - A JSON string of the SPPA profile data.
 */
export async function getSPPAProfile() {
  return fetchFromIDX('GetSPPAProfile', { start: 0, length: 9999 });
}

/**
 * Retrieves SPPA profile details by ID.
 * @param {number} id - The SPPA profile ID.
 * @returns {Promise<string>} - A JSON string of the SPPA profile details.
 */
export async function getSPPAProfileDetail(id) {
  return fetchFromIDX('GetSPPAProfileDetail', { id });
}
