import { decodeBase32768, encodeBase32768 } from "./base32768-source-code.js";
import {
  decodeBase64,
  encodeBase64,
} from "./base64-arraybuffer-source-code.js";
import { compare2buffer } from "./utils.js";

/** test converting arraybuffer to utf8, then back, see if it reverses correctly
 * @param {ArrayBuffer} buffer
 * @returns {string} the utf8 string constructed
 */
export function testUtf8(buffer) {
  console.time("convert to utf8");
  const result = new TextDecoder().decode(buffer);
  console.timeEnd("convert to utf8");

  console.log("result length:", result.length);
  if (result.length < 200) console.log("result:", result);

  console.time("decode utf8");
  const backFromUtf8 = new TextEncoder().encode(result);
  console.timeEnd("decode utf8");

  if (!compare2buffer(buffer, backFromUtf8)) {
    console.error("utf8 doesn't reverse correctly");
  }
  return result;
}

/** test converting arraybuffer to base32768, then back, see if it reverses correctly
 * @param {ArrayBuffer} buffer
 * @returns {string} the base32768 string constructed
 */
export function testBase32768(buffer) {
  console.time("to base32768");
  const arr = new Uint8Array(buffer);
  const result = encodeBase32768(arr);
  console.timeEnd("to base32768");

  console.log("base32768string.length:", result.length);
  if (result.length < 200) console.log("base32768:", result);

  console.time("decode base32768");
  const backFromBase32768 = decodeBase32768(result);
  console.timeEnd("decode base32768");

  if (!compare2buffer(buffer, backFromBase32768)) {
    console.error("base32768 doesn't reverse correctly");
  }
  return result;
}

/** test converting arraybuffer to base64, then back, see if it reverses correctly
 * @param {ArrayBuffer} buffer
 * @returns {string} the base64 string constructed
 */
export function testBase64(buffer) {
  console.time("convert to base64");
  const result = encodeBase64(buffer);
  console.timeEnd("convert to base64");

  console.log("base64string.length:", result.length);
  if (result.length < 100) console.log("base64:", result);

  console.time("decode base64");
  const backFromBase64 = new Uint8Array(decodeBase64(result));
  console.timeEnd("decode base64");

  if (!compare2buffer(buffer, backFromBase64)) {
    console.error("base64 doesn't reverse correctly");
  }
  return result;
}