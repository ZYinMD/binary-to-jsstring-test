import fs from 'node:fs/promises';
import { areEqual, decompress } from './modules/utils.js';
import { decodeBase64 } from './modules/base64-arraybuffer-source-code.js';
import { testBase64, testCompression } from './modules/tests.js';
import { dbv } from './input-and-outputs/dbv_douzhencang.js';

console.info(`\nCreate a random content arrayBuffer and test converting it to string...\n`);

console.info(
  `\nTest compressing dbv and dbvd with gzip, convert to base64, then write to file...\n`
);
const dbv_gzipped = await testCompression(dbv, 'gzip');
const dbv_in_base64 = testBase64(dbv_gzipped);
const dbv_gzipped_path = 'input-and-outputs/dbv_gzipped.txt';
await fs.writeFile(dbv_gzipped_path, dbv_in_base64);

console.log(
  `\nTest reading back the base64 from txt file, decode it, decompress it, and compare with the original...\n`
);

const fileContent = await fs.readFile(dbv_gzipped_path, 'utf8');
if (fileContent !== dbv_in_base64)
  throw `what's written to disk is different from what's read back`;

const decoded = decodeBase64(fileContent);
if (!areEqual(decoded, dbv_gzipped)) throw `decoded base64 is different from compressed string`;

const decompressed = await decompress(new Uint8Array(decoded), 'gzip');
if (decompressed !== dbv) throw `decompressed string is different from original`;
console.log('success!');
