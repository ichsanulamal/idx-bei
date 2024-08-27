improve code.

```
// Define the function to fetch bond data
async function fetchBondData(pageSize = 100, indexFrom = 13, bondType = 1) {
  try {
    const response = await fetch(`https://www.idx.co.id/secondary/get/BondSukuk/bond?pageSize=${pageSize}&indexFrom=${indexFrom}&bondType=${bondType}`, {
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

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
}

// Export the function
export { fetchBondData };
```



we have response: ```json

{
  ResultCount: 1235,
  Results: []
}```

the num result is in 'ResultCount'

please retrieve all numPage and add to results and export it to json. 

numPage is get from ResultCount and pageSize. so if ResultCount = 1235 and indexFrom = 100, it fetching 13 times 