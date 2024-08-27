import fs from "fs";

import { getTradeSummary } from "./market-data/trading-summary/trading-summary-and-recapitulation/getTradeSummary.js";
import { getRecapSummary } from "./market-data/trading-summary/trading-summary-and-recapitulation/getRecapSummary.js";

import { getIndexSummary } from "./market-data/trading-summary/index-summary/getIndexSummary.js";
import { getIndexIC } from "./market-data/trading-summary/index-summary/getIndexIC.js";
import { getConstituent } from "./market-data/trading-summary/index-summary/getConstituent.js";

import { getStockSummary } from "./market-data/trading-summary/stock-summary/getStockSummary.js";
import { getMarginSummary } from "./market-data/trading-summary/stock-summary/getMarginSummary.js";
import { getShortSellSummary } from "./market-data/trading-summary/stock-summary/getShortSellSummary.js";

import { getBrokerSummary } from "./market-data/trading-summary/broker-summary/GetBrokerSummary.js";

import { getPedSummary } from "./market-data/trading-summary/ped-summary/getPedSummary.js";

import { getIndexGroupPrevalues } from "./market-data/stocks-data/stock-index/getIndexGroupPrevalues.js";
import { getStockUploader } from "./market-data/stocks-data/stock-index/getStockUploader.js";

import { getSectors } from "./market-data/stocks-data/stock-list/getSectors.js";
import { getBoards } from "./market-data/stocks-data/stock-list/getBoards.js";
import { getSecuritiesStock } from "./market-data/stocks-data/stock-list/getSecuritiesStock.js";

import { getCompositeBondIndex } from "./market-data/bonds-sukuk/indobex/getCompositeBondIndex.js";
import { getGovernmentBondIndex } from "./market-data/bonds-sukuk/indobex/getGovernmentBondIndex.js";
import { getCorporateBondIndex } from "./market-data/bonds-sukuk/indobex/getCorporateBondIndex.js";

import { getGovIssuer } from "./market-data/bonds-sukuk/corporate-bonds-sukuk/getGovIssuer.js";
import { getBondSukuk } from "./market-data/bonds-sukuk/corporate-bonds-sukuk/getBondSukuk.js";

import { getETPTickerList } from "./market-data/bonds-sukuk/etp-trading/getETPTickerList.js";
import { getETPTradeActivity } from "./market-data/bonds-sukuk/etp-trading/getETPTradeActivity.js";
import { getETPMarketSnapshot } from "./market-data/bonds-sukuk/etp-trading/getETPMarketSnapshot.js";
import { getETPDailySummary } from "./market-data/bonds-sukuk/etp-trading/getETPDailySummary.js";
import { getETPSecurityList } from "./market-data/bonds-sukuk/etp-trading/getETPSecurityList.js";

const data = await getETPSecurityList();
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