import { compare2Uint8Array, randomUint8Array } from "./utils.js";
import { encode, decode } from "./base32768-source-code.js";
import {
  decodeBase64,
  encodeBase64,
} from "./base64-arraybuffer-source-code.js";

document.getElementById("main")?.addEventListener("click", () => {
  main();
});

/** main */
function main() {
  const arr = randomUint8Array();
  // console.log("arr:", arr);
  console.log("buffer length:", arr.length);
  {
    console.time("convert to utf8");
    const utf8 = new TextDecoder().decode(arr);
    console.timeEnd("convert to utf8");

    console.log("utf8.length:", utf8.length);
    if (arr.length < 1e3) console.log("utf8string:", utf8);

    console.time("decode utf8");
    const backFromUtf8 = new TextEncoder().encode(utf8);
    console.timeEnd("decode utf8");

    if (!compare2Uint8Array(arr, backFromUtf8))
      console.error("utf8 doesn't reverse correctly");
  }

  {
    console.time("base32768");
    const base32768 = encode(arr);
    console.timeEnd("base32768");

    console.log("base32768string.length:", base32768.length);
    if (arr.length < 1e3) console.log("base32768:", base32768);

    console.time("decode base32768");
    const backFromBase32768 = decode(base32768);
    console.timeEnd("decode base32768");

    if (!compare2Uint8Array(arr, backFromBase32768))
      console.error("base32768 doesn't reverse correctly");
  }

  {
    console.time("convert to base64");
    const base64 = encodeBase64(arr.buffer);
    console.timeEnd("convert to base64");

    console.log("base64string.length:", base64.length);
    if (arr.length < 1e3) console.log("base64:", base64);

    console.time("decode base64");
    const backFromBase64 = new Uint8Array(decodeBase64(base64));
    console.timeEnd("decode base64");

    if (!compare2Uint8Array(arr, backFromBase64))
      console.error("base64 doesn't reverse correctly");
  }
}
