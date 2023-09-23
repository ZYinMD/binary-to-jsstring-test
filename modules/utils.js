/** create a random integer between 0 and 1M, e.g. 817364 */
export function oneRandomNumber() {
  return Math.trunc(Math.random() * 1e6);
}
