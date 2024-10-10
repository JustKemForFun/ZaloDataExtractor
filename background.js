function captureRequests() {
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
      let url = details.url;
      let imeiFound = false;
      let imeiValue = "Not Found";

      // Check if IMEI param is present in the URL
      // imeiValue = localStorage.getItem("z_uuid"); // === sh_z_uuid
      if (url.includes("/api/login/getServerInfo") && url.indexOf("imei=") > -1) {
        let params = new URLSearchParams(new URL(url).search);
            imeiFound = true;
            imeiValue = params.get("imei");

        chrome.runtime.sendMessage({ action: "IMEIValue", imei: imeiValue });

      }

      // If IMEI is found and URL is chat.zalo.me, get cookies || error pls create an issue github.com/JustKemForFun/ZaloDataExtractor
      if (imeiFound && url.includes("chat.zalo.me")) {
        chrome.cookies.getAll({ url: url }, function (cookies) {
          let cookiesDict = {};

          for (let i = 0; i < cookies.length; i++) {
            cookiesDict[cookies[i].name] = cookies[i].value;
          }

          // let listString = [
          //   "_zlang",
          //   "app.event.zalo.me",
          //   "zpw_sek",
          //   "__zi", // === "__zi-legacy"
          //   "zoaw_sek",
          //   "zoaw_type",
          //   "zpsid",
          // ];
          
          // let listStringZalo = [
          //   // "_ga",
          //   "zpsid",
          //   "app.event.zalo.me",
          //   "zpw_sek",
          //   "__zi",
          //   "__zi-legacy",
          //   "zoaw_sek",
          //   "zoaw_type",
          //   "_zlang",
          // ];
      
          // let cookieArray = listString
          //   .map((name) => `${name}=${cookiesDict[name]}`)
          //   .filter((cookie) => cookie.includes('='));

          let cookieArray = Object.entries(cookiesDict).map(([name, value]) => `${name}=${value}`);
          let cookieString = cookieArray.join("; "); // (";")

          chrome.runtime.sendMessage({
            action: "CookiesValue",
            cookies: cookieString,
          });

        });
      }

      // Get and send User-Agent
      let userAgent = navigator.userAgent;
      chrome.runtime.sendMessage({ action: "UserAgent", useragent: userAgent });

    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
}

captureRequests();
