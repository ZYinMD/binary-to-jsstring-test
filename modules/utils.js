/** create a random number
 * @param {number} ceiling - the result will be smaller than this
 */
export function randomInteger(ceiling) {
  return Math.trunc(Math.random() * ceiling);
}

/** create a random length (up to 10M) Uint8Array containing random bytes. */
export function randomUint8Array() {
  return new Uint8Array(randomInteger(100)).map(() => randomInteger(256));
}
