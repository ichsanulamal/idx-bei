import { fetchData } from "../../utils/template.js"

const url = "https://www.idx.co.id/primary/EDD/GetDinfraMarket?start=0&length=9999"
const referrer = "https://www.idx.co.id/en/market-data/reits-dinfra/"

fetchData(url, referrer)
.then(
    res => console.log(res['data']))
  ;