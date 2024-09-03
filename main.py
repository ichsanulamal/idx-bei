import requests

url = 'https://www.traveloka.com/api/v2/bus/search/inventory/v3'
headers = {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'cookie': 'tv-repeat-visit=true; countryCode=ID; tv_user={"authorizationLevel":100,"id":null}; selectedCurrency=IDR; selectedLocale=en_ID; aws-waf-token=949a5cd0-ec1b-4a23-9643-092f6a44bdf9:GgoAgJorTdwAAAAA:9xIAxByRS8KSrKscu9yD4wW1ieSQeUq5r5bptSn1YkJeZYakkxPjkbiDs+gjLt8W6mUGP0HZ11WmGOats1egyIctGjO8CPZictVzd5gzv/8xhuvEmBYISrRYt0yixE2dc7wzsBqwDB67a0NCiXuVP1d+Eia3JlxHDFR/oTzPZSs504ds3N/7PoxSPwyLAO4jta8=; tvl=MG2aHtcMPqX5h+fIZeveP/hBYyzXhu/GLYOrwuaHZxBJhy1BUuTXf2n2419TsCzS7Ht2zuwo1mtmVatkd8YKypbafeYP8bqOR3TqGn2nQfabyBKitHEpzUVPFfkIEr4REIngzSOxO9g78QAb3FzOcKXEjC8AINjMHcQOMD+fSVmvXYQZeE7/jhigtIprBe7MuCYcMkFdVZo8FT0l/Alb+JzP/GmybQb4tuHSZs5Pk4pENSNJGkLquh23+7mA8h5lWvpXvv46r18=~djAy; tvs=ZhNJcPoOgGeOjc5aW2151OYorNYhTUHO+AGr6AoBa8AiUHtLaBCpRjt/VRx6zWGVNbXqE2Xoh33bpci3hAiU1KIoC7jor12blX4BbzZHjpTjZPEA4nkdu62qHCdmmJkLqDSIQ/wOsykhUqlZXKrtfLKlMvOj9u52bLXyFONndJ4qC7TsJeC8gIbQ3+lxwW32ZgUwqc1w4w==~djAy; _dd_s=rum=0&expire=1725171977146&logs=1&id=2d54fd5a-eac2-42ea-bc5f-4e11111011f3&created=1725168359466',
    'origin': 'https://www.traveloka.com',
    'priority': 'u=1, i',
    'referer': 'https://www.traveloka.com/en-id/bus-and-shuttle/search?st=a103859.a106587&stt=CITY_GEO.CITY_GEO&stn=Bandung.Semarang&dt=05-10-2024.null&ps=1',
    'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'x-domain': 'bus',
    'x-route-prefix': 'en-id'
}
data = {
    "fields": [],
    "data": {
        "originCode": "a103859",
        "originType": "CITY_GEO",
        "originName": "Bandung",
        "destinationCode": "a106587",
        "destinationType": "CITY_GEO",
        "destinationName": "Semarang",
        "departureDate": {"month": 10, "day": 5, "year": 2024},
        "numAdult": 1,
        "currency": "IDR",
        "deviceFunnel": "MAIN",
        "backendTrackingMap": {
            "funnelSource": "redirection",
            "funnelId": None,
            "primaryProductType": "unknown"
        },
        "searchEntrySource": "SEARCH_FORM_PAGE"
    },
    "clientInterface": "desktop"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
