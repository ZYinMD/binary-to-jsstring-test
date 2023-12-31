import { dbv } from './input-and-outputs/dbv_douzhencang.js';
import { dbvd } from './input-and-outputs/dbvd_douzhencang.js';
import { decodeBase64, encodeBase64 } from './modules/base64-arraybuffer-source-code.js';
import { testBase32768, testBase64, testCompression, testUtf8 } from './modules/tests.js';
import {
  areEqual,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  randomUint8Array,
} from './modules/utils.js';

document
  .querySelector('button#test-compress-string-to-binary')
  ?.addEventListener('click', async () => {
    console.log('testing dbv:');
    await testCompression(dbv, 'deflate');
    await testCompression(dbv, 'gzip');

    console.log('testing dbvd:');
    await testCompression(dbvd, 'deflate');
    await testCompression(dbvd, 'gzip');
  });

document.querySelector('button#test-converting-binary-to-string')?.addEventListener('click', () => {
  const arr = randomUint8Array(200); // a random array of 10MB
  testUtf8(arr.buffer);
  testBase32768(arr.buffer);
  testBase64(arr.buffer);
});

document.querySelector('button#compare-base64-performance')?.addEventListener('click', async () => {
  console.log('\nCompare performance of 3 base64 encoding methods\n');
  const buffer = randomUint8Array(5e6).buffer;

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

  if (base64_npm === base64_native) console.info('npm and native produce the same base64 string');
  else console.error('npm and native produce different base64 string');

  console.log(`btoa can't handle big buffers, so we only test the converting back:`);
  console.time('use atob to convert back');
  const binString = atob(base64_native);
  const back_atob = Uint8Array.from(binString, (m) => m.codePointAt(0)).buffer;
  console.timeEnd('use atob to convert back');
  if (!areEqual(back_atob, buffer)) console.error("atob doesn't reverse correctly");
});
