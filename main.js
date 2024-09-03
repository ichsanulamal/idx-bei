import fs from "fs";

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
import { getSecuritiesStock } from './market-data/stocks-data/stock-list/getSecuritiesStock.js';


import { getIndexIC } from "./market-data/trading-summary/index-summary/getIndexIC.js";

import * as mp from './members-and-participants/memberProfiles.js'




import { getEmiten } from "./market-data/structured-warrant-sw/structured-warrant-information/getEmiten.js";

const response = await fetch("https://www.traveloka.com/api/v2/bus/search/inventory/v3", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-domain": "bus",
    "x-route-prefix": "en-id"
  },
  "referrer": "https://www.traveloka.com/en-id/bus-and-shuttle/search?st=a103859.a106587&stt=CITY_GEO.CITY_GEO&stn=Bandung.Semarang&dt=05-10-2024.null&ps=1",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"fields\":[],\"data\":{\"originCode\":\"a103859\",\"originType\":\"CITY_GEO\",\"originName\":\"Bandung\",\"destinationCode\":\"a106587\",\"destinationType\":\"CITY_GEO\",\"destinationName\":\"Semarang\",\"departureDate\":{\"month\":10,\"day\":5,\"year\":2024},\"numAdult\":1,\"currency\":\"IDR\",\"deviceFunnel\":\"MAIN\",\"backendTrackingMap\":{\"funnelSource\":\"redirection\",\"funnelId\":null,\"primaryProductType\":\"unknown\"},\"searchEntrySource\":\"SEARCH_FORM_PAGE\"},\"clientInterface\":\"desktop\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(response => response.json())
.then(data => {
  console.log(data);
  fs.writeFile('data.json', JSON.stringify(data['data'], null, 2), (err) => err );
}
  
);
// console.log(response.json() );

// const data = await getEmiten();

// // Write JSON to file
// fs.writeFile('data.json', data, (err) => {
//   if (err) {
//     console.error('Error writing to file', err);
//   } else {
//     console.log('Data successfully written to file');
//   }
// });
