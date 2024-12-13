// window.addEventListener('load', function() { /* my code */ });
window.addEventListener("load", function () {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "IMEIValue") {
      document.getElementById("imei").value = request.imei;
      document.getElementById("imei").parentElement.classList.remove("is-disabled");
    } else if (request.action === "CookiesValue") {
      document.getElementById("cookies").value = request.cookies;
      document.getElementById("cookies").parentElement.classList.remove("is-disabled");
    } else if (request.action === "UserAgent") {
      document.getElementById("user-agent").value = request.useragent;
      document.getElementById("user-agent").parentElement.classList.remove("is-disabled");
    }
  });
});