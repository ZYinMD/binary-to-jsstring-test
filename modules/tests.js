import { decodeBase32768, encodeBase32768 } from './base32768-source-code.js';
import { decodeBase64, encodeBase64 } from './base64-arraybuffer-source-code.js';
import { areEqual, compress, decompress } from './utils.js';

/**
 * compress then reverse the input text to arrayBuffer using either gzip or deflate, assert it's the same as original,  output the time taken using console.time()
 * @param {string} text the input text
 * @param {'gzip'|'deflate'} algorithm
 */
export async function testCompression(text, algorithm) {
  console.time(`compress with ${algorithm}`);
  const compressed = await compress(text, algorithm);
  console.timeEnd(`compress with ${algorithm}`);
  console.log('result:', compressed.byteLength, 'bytes');

  console.time(`decompress with ${algorithm}`);
  const decompressedText = await decompress(new Uint8Array(compressed), algorithm);
  console.timeEnd(`decompress with ${algorithm}`);
  console.assert(text === decompressedText);
  return compressed;
}

/** test converting arraybuffer to utf8, then back, see if it reverses correctly
 * from trial and error I found that the test will fail as long as the array contains any byte bigger than 127
 * @param {ArrayBuffer} buffer
 * @returns {string} the utf8 string constructed
 */
export function testUtf8(buffer) {
  console.log('convert to utf8 and back:');
  const result = new TextDecoder().decode(buffer);

  if (result.length < 300) console.log('result:', result);

  const backFromUtf8 = new TextEncoder().encode(result);

  if (!areEqual(buffer, backFromUtf8)) {
    console.error("utf8 doesn't reverse correctly");
  } else console.log('Success!\n');

  console.log('\n');
  return result;
}

/** test converting arraybuffer to base32768, then back, see if it reverses correctly
 * @param {ArrayBuffer} buffer
 * @returns {string} the base32768 string constructed
 */
export function testBase32768(buffer) {
  console.log('convert to base32768 and back:');
  const arr = new Uint8Array(buffer);
  const result = encodeBase32768(arr);

  if (result.length < 300) console.log('base32768:', result);

  const backFromBase32768 = decodeBase32768(result);

  if (!areEqual(buffer, backFromBase32768)) {
    console.error("base32768 doesn't reverse correctly");
  } else console.log('Success!\n');
  console.log('\n');
  return result;
}

/** test converting arraybuffer to base64, then back, see if it reverses correctly
 * @param {ArrayBuffer} buffer
 * @returns {string} the base64 string constructed
 */
export function testBase64(buffer) {
  console.log('convert to base64 and back:');
  const result = encodeBase64(buffer);

  if (result.length < 300) console.log('base64:', result);

  const backFromBase64 = new Uint8Array(decodeBase64(result));

  if (!areEqual(buffer, backFromBase64)) {
    console.error("base64 doesn't reverse correctly");
  } else console.log('Success!\n');
  console.log('\n');
  return result;
}
