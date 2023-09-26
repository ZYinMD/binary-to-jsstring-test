import { dbv } from './input-and-outputs/dbv.js';
import { dbvd } from './input-and-outputs/dbvd.js';
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
  const arr = randomUint8Array();
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
