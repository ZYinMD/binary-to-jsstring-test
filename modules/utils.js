/** create a random number
 * @param {number} ceiling - the result will be smaller than this
 */
export function randomInteger(ceiling) {
  return Math.trunc(Math.random() * ceiling);
}

/** create a random length (up to 10M) Uint8Array containing random bytes. */
export function randomUint8Array() {
  const result = new Uint8Array(randomInteger(10e6)).map(() => randomInteger(256));
  const mb = (result.length / 1024 / 1024).toFixed(1);
  console.log(`created random Uint8Array of ${mb}MB for testing`);
  console.log('');
  return result;
}

/** compare two buffers to see if they're the same
 * @param {ArrayBufferLike} buffer1
 * @param {ArrayBufferLike} buffer2
 */
export function areEqual(buffer1, buffer2) {
  const arr1 = new Uint8Array(buffer1);
  const arr2 = new Uint8Array(buffer2);
  for (let index in arr1) {
    if (arr1[index] !== arr2[index]) {
      console.error(
        `arr1 length ${arr1.length}, arr2 length ${arr2.length}, first unequal at length ${index}`
      );
      return false;
    }
  }
  return true;
}

export function compress(string, encoding) {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray, algorithm) {
  const cs = new DecompressionStream(algorithm);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then((arrayBuffer) => {
    return new TextDecoder().decode(arrayBuffer);
  });
}

/**
 * @param {string} text
 * @param {'gzip'|'deflate'} algorithm
 */
export async function testCompression(text, algorithm) {
  console.time(`compress with ${algorithm}`);
  const compressedData = await compress(text, algorithm);
  console.timeEnd(`compress with ${algorithm}`);
  console.log('result:', compressedData.byteLength, 'bytes');

  console.time(`decompress with ${algorithm}`);
  const decompressedText = await decompress(compressedData, algorithm);
  console.timeEnd(`decompress with ${algorithm}`);
  console.assert(text === decompressedText);
}

// (async function () {
//   await testCompression(test, 'deflate');
//   await testCompression(test, 'gzip');
// })();
