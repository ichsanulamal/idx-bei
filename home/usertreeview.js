const fs = require('fs');

fetch("https://www.idx.co.id/support/user/api/menu/usertreeview?lang=en", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "https://www.idx.co.id/en",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  })
  .then(
    res => res.json())
  .then(data => {
    const jsonData = JSON.stringify(data, null, 2); // The `null` and `2` are for formatting the JSON with indentation

  fs.writeFile('usertreeview.json', jsonData, (err) => {
    if (err) {
      console.error('Error writing file', err);
    } else {
      console.log('File successfully written');
    }
  });}
  )
  ;