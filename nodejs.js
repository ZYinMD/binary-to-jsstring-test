import fs from 'node:fs/promises';
import { testBase32768, testBase64, testUtf8 } from './modules/tests.js';
import { randomUint8Array } from './modules/utils.js';

const arr = randomUint8Array();
await fs.writeFile('input-and-outputs/binary-to-utf8.txt', testUtf8(arr.buffer));
await fs.writeFile('input-and-outputs/binary-to-base64.txt', testBase64(arr.buffer));
await fs.writeFile('input-and-outputs/binary-to-base32768.txt', testBase32768(arr.buffer));
