import fs from "fs";

export { BondSukuk } from "./market-data/bonds-sukuk/corporate-bonds-sukuk/BondSukuk.js";

import { getBoards } from "./market-data/stocks-data/stock-list/getBoards.js";
import { getSectors } from "./market-data/stocks-data/stock-list/getSectors.js";
import { getSecuritiesStock } from "./market-data/stocks-data/stock-list/getSecuritiesStock.js";
import { getGovIssuer } from "./market-data/bonds-sukuk/corporate-bonds-sukuk/getGovIssuer.js";


import { getTradeSummary } from "./market-data/trading-summary/trading-summary-and-recapitulation/getTradeSummary.js";
import { getRecapSummary } from "./market-data/trading-summary/trading-summary-and-recapitulation/getRecapSummary.js";

import { getIndexSummary } from "./market-data/trading-summary/index-summary/getIndexSummary.js";
import { getIndexIC } from "./market-data/trading-summary/index-summary/getIndexIC.js";
import { getConstituent } from "./market-data/trading-summary/index-summary/getConstituent.js";



const data = await getConstituent();
// console.log(data);
// const jsonData = JSON.stringify(data, null, 2); // `null` and `2` are for pretty-printing

// Write JSON to file
fs.writeFile('data.json', data, (err) => {
  if (err) {
    console.error('Error writing to file', err);
  } else {
    console.log('Data successfully written to file');
  }
});