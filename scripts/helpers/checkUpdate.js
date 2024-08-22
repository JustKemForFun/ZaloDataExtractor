import config from '../../config.js';

const versionSpan = document.querySelector("#version");
const updateBtn = document.querySelector("#update-btn");

export async function checkUpdate() {
  try {
    let currentVersion = 'unknown';

    if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.getManifest === 'function') {
      try {
        currentVersion = chrome.runtime.getManifest().version;
      } catch (chromeError) {
        console.warn("Error getting manifest version:", chromeError);
      }
    } else {
      console.warn("Not running in a Chrome extension environment");
      currentVersion = config.fallbackVersion || 'unknown';
    }

    console.log("Current Version:", currentVersion);

    const { version_check, source_code } = config;
    const latestVersion = (await (await fetch(version_check)).json()).version;

    console.log("Latest Version from API:", latestVersion);

    if (updateBtn) {
      if (latestVersion > currentVersion) {
        versionSpan.innerHTML = "";
        updateBtn.style.display = "inline-block";
        updateBtn.innerHTML = "V" + latestVersion;
        updateBtn.setAttribute("data-tooltip", "Update available New V" + latestVersion);
        updateBtn.setAttribute("data-flow", "bottom");
        updateBtn.onclick = () => {
          window.open(source_code);
        };
      } else if (currentVersion !== 'unknown') {
        updateBtn.style.display = "none";
        versionSpan.innerHTML = "V" + currentVersion + " (latest)";
      } else {
        updateBtn.style.display = "none";
        versionSpan.innerHTML = "Version check unavailable";
      }
    }
  } catch (e) {
    console.warn("Check for update failed", e);
    if (versionSpan) versionSpan.innerHTML = "Version check failed";
    if (updateBtn) updateBtn.style.display = "none";
  }
}
