// const fetch = require('node-fetch');

class CompanyProfile {
    constructor(emitenCode) {
        this.emitenCode = emitenCode;
        this.baseUrl = 'https://www.idx.co.id/primary/';
    }

    // Helper function to fetch data from the server
    async fetchData(endpoint, params = {}, referrer) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        console.log(`Fetching ${url}`);
        const response = await fetch(url, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                // You can add more headers if needed
            },
            referrer: referrer,
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    }

    async getCompanyProfiles() {
        return await this.fetchData('ListedCompany/GetCompanyProfiles', {
            emitenType: 's',
            start: 0,
            length: 9999
        }, 'https://www.idx.co.id/en/listed-companies/company-profiles');
    }

    async getCompanyDetails() {
        return await this.fetchData('ListedCompany/GetCompanyProfilesDetail', {
            KodeEmiten: this.emitenCode,
            language: 'en-us'
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getIssuedHistory() {
        return await this.fetchData('ListingActivity/GetIssuedHistory', {
            kodeEmiten: this.emitenCode,
            start: 0,
            length: 9999
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getProfileAnnouncement(dateFrom, dateTo) {
        return await this.fetchData('ListedCompany/GetProfileAnnouncement', {
            KodeEmiten: this.emitenCode,
            indexFrom: 0,
            pageSize: 10,
            dateFrom: dateFrom,
            dateTo: dateTo,
            lang: 'en',
            keyword: ''
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getCalendar(date) {
        return await this.fetchData('Home/GetCalendar', {
            range: this.emitenCode,
            date: date
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getFinancialReport(year) {
        return await this.fetchData('ListedCompany/GetFinancialReport', {
            periode: 'audit',
            year: year,
            indexFrom: 0,
            pageSize: 1000,
            reportType: 'rdf',
            kodeEmiten: this.emitenCode
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getNameChangeHistory(year) {
        return await this.fetchData('ListedCompany/GetPerubahanNamaHistory', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getCoreBusinessHistory(year) {
        return await this.fetchData('ListedCompany/GetCoreBusinessHistory', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getShareholderHistory(year) {
        return await this.fetchData('ListedCompany/GetPemegangSahamHistory', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getControllingShareholderHistory(year) {
        return await this.fetchData('ListedCompany/GetPemegangSahamPengendaliHistory', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getCashDividend(year) {
        return await this.fetchData('ListedCompany/GetDividenTunai', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }

    async getStockDividend(year) {
        return await this.fetchData('ListedCompany/GetDividenSaham', {
            KodeEmiten: this.emitenCode,
            Year: year
        }, `https://www.idx.co.id/en/listed-companies/company-profiles/${this.emitenCode}`);
    }
}

module.exports = CompanyProfile;