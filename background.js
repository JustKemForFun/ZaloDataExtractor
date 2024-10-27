function captureRequests() {
    chrome.webRequest.onBeforeRequest.addListener(function (details) {
        let url = details.url;
        let imeiFound = false;
        let imeiValue = "Not Found";

        if (url.includes("/api/login/getServerInfo") && url.indexOf("imei=") > -1) {
          let params = new URLSearchParams(new URL(url).search);
              imeiFound = true;
              imeiValue = params.get("imei");
  
          chrome.runtime.sendMessage({ action: "IMEIValue", imei: imeiValue });
  
        }
  
        // error pls create an issue github.com/JustKemForFun/ZaloDataExtractor
        if (imeiFound && url.includes("chat.zalo.me")) {
          chrome.cookies.getAll({ url: url }, function (cookies) {
            let cookiesDict = {};
  
            for (let i = 0; i < cookies.length; i++) {
              cookiesDict[cookies[i].name] = cookies[i].value;
            }
  
            let cookiesObject = Object.entries(cookiesDict).map(([key, value]) => `"${key}": "${value}"`).join(",\n");
            cookiesObject = "{\n" + cookiesObject + "\n}";
  
            chrome.runtime.sendMessage({
              action: "CookiesValue",
              cookies: cookiesObject,
            });
  
          });
        }

        let userAgent = navigator.userAgent;
        chrome.runtime.sendMessage({ action: "UserAgent", useragent: userAgent });
  
      },
      { urls: ["<all_urls>"] },
      ["requestBody"]
    );
  }
  
  captureRequests();