/** create a random number
 * @param {number} ceiling - the result will be smaller than this
 */
export function randomInteger(ceiling) {
  return Math.trunc(Math.random() * ceiling);
}

/** create Uint8Array containing random bytes.
 * @param {number} length - how many bytes in the array
 */
export function randomUint8Array(length) {
  const result = new Uint8Array(length).map(() => randomInteger(256));
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

/**
 * zip string to bytes
 * @param {string} string
 * @param {'gzip'|'deflate'} algorithm
 * @returns {ArrayBuffer}
 */
export function compress(string, algorithm) {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(algorithm);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

/**
 * unzip compressed bytes to string
 * @param {Uint8Array} bytes
 * @param {'gzip'|'deflate'} algorithm
 * @returns {string}
 */
export function decompress(bytes, algorithm) {
  const cs = new DecompressionStream(algorithm);
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then((arrayBuffer) => {
    return new TextDecoder().decode(arrayBuffer);
  });
}

/** convert arrayBuffer to base64 using the fileReader API, which is the most performant way according to my test.
 * @param {ArrayBuffer} buffer
 * @returns {Promise<string>}
 */
export async function arrayBufferToBase64(buffer) {
  try {
    const file = new File([buffer], 'temp.bin', { type: 'application/octet-stream' });
    const fileReader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.readAsDataURL(file);
    }); // something like `data:application/octet-stream;base64,AQpy3Es9Ja0Abb=`
    return dataUrl.split('base64,')[1];
  } catch (err) {
    console.error(err);
  }
}

/** convert base64 string to arrayBuffer using fetch API, which is not the most performant
 * @param {string} base64string
 */
export async function base64ToArrayBuffer(base64string) {
  const res = await fetch(`data:application/octet-stream;base64,${base64string}`);
  return await res.arrayBuffer();
}
