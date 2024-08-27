const fs = require('fs');

// Helper function to build the fetch URL
function buildFetchUrl(pageSize, indexFrom, bondType) {
  return `https://www.idx.co.id/secondary/get/BondSukuk/bond?pageSize=${pageSize}&indexFrom=${indexFrom}&bondType=${bondType}`;
}

// Helper function to fetch data from the server
async function fetchData(url) {
  const response = await fetch(url, {
    headers: {
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
    referrer: "https://www.idx.co.id/en/market-data/bonds-sukuk/corporate-bonds-sukuk/",
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

// Main function to fetch bond data with pagination
async function fetchBondData(pageSize = 100, initialIndexFrom = 1, bondType = 1) {
  const allResults = [];
  let indexFrom = initialIndexFrom;

  try {
    const initialUrl = buildFetchUrl(pageSize, indexFrom, bondType);
    const initialData = await fetchData(initialUrl);

    const totalResultCount = initialData.ResultCount;
    const totalPages = Math.ceil(totalResultCount / pageSize);

    while (indexFrom <= totalPages) {
      console.log(indexFrom);

      const url = buildFetchUrl(pageSize, indexFrom, bondType);
      const data = await fetchData(url);

      console.log(data.Results);
      allResults.push(...data.Results);

      indexFrom += 1; // Move to the next page
    }

    return allResults;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

fetchBondData().then(data => {
  
  const jsonData = JSON.stringify(data, null, 2); // The `null` and `2` are for formatting the JSON with indentation

  fs.writeFile('data.json', jsonData, (err) => {
    if (err) {
      console.error('Error writing file', err);
    } else {
      console.log('File successfully written');
    }
  });
  
});
