function captureRequests() {
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
      let url = details.url;
      let imeiFound = false;
      let imeiValue = "Not Found";

      // Check if IMEI param is present in the URL
      if (url.includes("/api/login/getServerInfo") && url.indexOf("imei=") > -1) {
        let params = new URLSearchParams(new URL(url).search);
            imeiFound = true;
            imeiValue = params.get("imei");

        chrome.runtime.sendMessage({ action: "IMEIValue", imei: imeiValue });

        // let notificationOptions = {
        //   type: "basic",
        //   title: "IMEI Found",
        //   message: "Successfully get IMEI",
        //   iconUrl: "/images/success.png",
        // };
        // chrome.notifications.create(notificationOptions);
      }

      // If IMEI is found and URL is chat.zalo.me, get cookies
      if (imeiFound && url.includes("chat.zalo.me")) {
        chrome.cookies.getAll({ url: url }, function (cookies) {
          let cookiesDict = {};

          for (let i = 0; i < cookies.length; i++) {
            cookiesDict[cookies[i].name] = cookies[i].value;
          }

          let cookieArray = Object.entries(cookiesDict).map(([name, value]) => `${name}=${value}`);
          let cookieString = cookieArray.join("; ");

          chrome.runtime.sendMessage({
            action: "CookiesValue",
            cookies: cookieString,
          });

          // let notificationOptions = {
          //   type: "basic",
          //   title: "Cookies Found",
          //   message: "Successfully get Cookies",
          //   iconUrl: "/images/success.png",
          // };
          // chrome.notifications.create(notificationOptions);
        });
      }

      // Get and send User-Agent
      let userAgent = navigator.userAgent;
      chrome.runtime.sendMessage({ action: "UserAgent", useragent: userAgent });

      // let notificationOptions = {
      //   type: "basic",
      //   title: "User-Agent Found",
      //   message: "Successfully get User-Agent",
      //   iconUrl: "/images/success.png",
      // };
      // chrome.notifications.create(notificationOptions);
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
}

captureRequests();
