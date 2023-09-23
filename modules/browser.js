import { testBase32768, testBase64, testUtf8 } from "./tests.js";
import { randomUint8Array } from "./utils.js";

document.getElementById("main")?.addEventListener("click", () => {
  handleClick();
});

/** main */
function handleClick() {
  const arr = randomUint8Array();
  testUtf8(arr.buffer);
  testBase32768(arr.buffer);
  testBase64(arr.buffer);
}
