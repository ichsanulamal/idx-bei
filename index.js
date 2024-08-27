import fs from "fs";

export { BondSukuk } from "./market-data/bonds-sukuk/corporate-bonds-sukuk/BondSukuk.js";

import { getBoards } from "./market-data/stocks-data/stock-list/getBoards.js";
import { getSectors } from "./market-data/stocks-data/stock-list/getSectors.js";
import { getSecuritiesStock } from "./market-data/stocks-data/stock-list/getSecuritiesStock.js";


const data = await getSecuritiesStock('', 'Transportation & Logistic', '');
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