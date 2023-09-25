import { testBase32768, testBase64, testUtf8 } from "./modules/tests.js";
import { randomUint8Array } from "./modules/utils.js";

document.getElementById("main")?.addEventListener("click", () => {
  handleClick();
});

/** main */
function handleClick() {
  // const arr = new Uint8Array([1, 10, 100, 110, 130, 111]);
  const arr = randomUint8Array();
  testUtf8(arr.buffer);
  testBase32768(arr.buffer);
  testBase64(arr.buffer);
}
