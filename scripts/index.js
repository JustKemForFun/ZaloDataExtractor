import { checkUpdate } from './helpers/checkUpdate.js';

(async function () {
  try {
    await checkUpdate(); // Thêm 'await' để đảm bảo hàm 'checkUpdate' hoàn thành trước khi tiếp tục
  } catch (e) {
    console.error("Error calling checkUpdate:", e);
  }
})();
