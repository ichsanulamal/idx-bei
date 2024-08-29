import { 
    getCompanyProfiles,
    getCompanyProfileDetail,
    getIssuedHistory,
    getProfileAnnouncement,
    getCalendar,
    getFinancialReport,
    getNameChangeHistory,
    getCoreBusinessHistory,
    getShareholderHistory,
    getControllingShareholderHistory,
    getCashDividend,
    getStockDividend 
} from './listed-companies/companyProfiles.js';

import * as mp from './members-and-participants/memberProfiles.js'

const main = async () => {
    try {
        
        // const companyProfiles = await getCompanyProfiles();
        // console.log('Company Profiles:', companyProfiles);

        // const kodeEmiten = 'ABSM';
        // const companyDetail = await getCompanyProfileDetail(kodeEmiten);
        // console.log('Company Detail:', companyDetail);

        const companyDetail = await mp.getBrokerSearch();
        console.log('Company Detail:', companyDetail);
    } catch (error) {
        console.error('Error in main:', error);
    }
};

// Run the main function
main();
