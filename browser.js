import { dbv } from './input-and-outputs/dbv.js';
import { dbvd } from './input-and-outputs/dbvd.js';
import { decodeBase64, encodeBase64 } from './modules/base64-arraybuffer-source-code.js';
import { testBase32768, testBase64, testUtf8 } from './modules/tests.js';
import {
  areEqual,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  randomUint8Array,
  testCompression,
} from './modules/utils.js';

document
  .querySelector('button#test-compress-string-to-binary')
  ?.addEventListener('click', async () => {
    await testCompression(dbv, 'deflate');
    await testCompression(dbv, 'gzip');
    await testCompression(dbvd, 'deflate');
    await testCompression(dbvd, 'gzip');
  });

document.querySelector('button#test-converting-binary-to-string')?.addEventListener('click', () => {
  // const arr = new Uint8Array([1, 10, 100, 110, 130, 111]);
  const arr = randomUint8Array(1e7);
  testUtf8(arr.buffer);
  testBase32768(arr.buffer);
  testBase64(arr.buffer);
});

document
  .querySelector('button#array-buffer-to-base64-and-back')
  ?.addEventListener('click', async () => {
    const arr = new Uint8Array([1, 10, 100, 200]);
    const base64 = await arrayBufferToBase64(arr.buffer);
    const back = await base64ToArrayBuffer(base64);
    const success = areEqual(back, arr.buffer);
    if (!success) throw 'changed array buffer to base64 and back, result is different from input';
    console.info('Success!\n');
  });

document.querySelector('button#compare-base64-performance')?.addEventListener('click', async () => {
  console.log('\nCompare performance of two base64 encoding methods - npm vs native\n');
  const buffer = randomUint8Array(1e7).buffer;

  console.time('use npm to convert to base64');
  const base64_npm = encodeBase64(buffer);
  console.timeEnd('use npm to convert to base64');
  console.time('use npm to convert back');
  const back_npm = decodeBase64(base64_npm);
  console.timeEnd('use npm to convert back');
  if (!areEqual(back_npm, buffer)) console.error("npm base64 doesn't reverse correctly");

  console.time('use fileReader to convert to base64');
  const base64_native = await arrayBufferToBase64(buffer);
  console.timeEnd('use fileReader to convert to base64');
  console.time('use fetch to convert back');
  const back_native = await base64ToArrayBuffer(base64_native);
  console.timeEnd('use fetch to convert back');
  if (!areEqual(back_native, buffer)) console.error("fileReader base64 doesn't reverse correctly");

  if (base64_npm === base64_native) console.info('the two methods produce the same base64 string');
  else console.error('the two methods produce different base64 string');
});
