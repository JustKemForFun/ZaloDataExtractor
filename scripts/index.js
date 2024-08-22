import { checkUpdate } from './helpers/checkUpdate.js';

(async function () {
  try {
    await checkUpdate();
  } catch (e) {
    console.error("Error calling checkUpdate:", e);
  }
})();
