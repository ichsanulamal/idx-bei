import fs from "fs";

import { fetchData } from "../utils/template.js";

const url = "https://www.idx.co.id/support/user/api/menu/usertreeview?lang=en";
const referrer = "https://www.idx.co.id/en";

fetchData(url, referrer).then((res) => console.log(res["items"]));
