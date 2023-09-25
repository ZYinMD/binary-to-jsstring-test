import { testBase32768, testBase64, testUtf8 } from "./modules/tests.js";
import { randomUint8Array } from "./modules/utils.js";
import fs from "node:fs/promises";

const arr = randomUint8Array();
await fs.writeFile("utf8.txt", testUtf8(arr.buffer));
await fs.writeFile("base32768.txt", testBase32768(arr.buffer));
await fs.writeFile("base64.txt", testBase64(arr.buffer));
