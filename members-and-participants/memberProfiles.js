import { fetchData } from '../fetchUtil.js';

// Base URL for API endpoints
const BASE_URL = 'https://www.idx.co.id/primary';

// Exchange Members Profiles
export const getBrokerSearch = () => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetBrokerSearch?option=0&license=&start=0&length=9999`);
};

export const getBrokerDetail = (code) => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetBrokerDetail?code=${code}`);
};

export const getMkbdSummary = (code) => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetMkbdSummary?code=${code}`);
};

export const getBranch = (code, start = 0, length = 10) => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetBranch?code=${code}&start=${start}&length=${length}`);
};

// Participants Profiles
export const getParticipantSearch = () => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetParticipantSearch?draw=1&start=0&length=9999&licenseType=All`);
};

export const getParticipantDetail = (code) => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetParticipantDetail?code=${code}`);
};

// Primary Dealers Profiles
export const getPrimaryDealerSearch = () => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetPrimaryDealerSearch?draw=1&start=0&length=9999&licenseType=0`);
};

export const getPrimaryDealerDetail = (code) => {
    return fetchData(`${BASE_URL}/ExchangeMember/GetPrimaryDealerDetail?code=${code}`);
};

// Indonesia Alternative Market Trading System User Profile
export const getSPPAProfile = () => {
    return fetchData(`${BASE_URL}/NewsAnnouncement/GetSPPAProfile?start=0&length=9999`);
};

export const getSPPAProfileDetail = (id) => {
    return fetchData(`${BASE_URL}/NewsAnnouncement/GetSPPAProfileDetail?id=${id}`);
};
