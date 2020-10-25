import randInt from "./randInt";

export default function sample<T>(arr: T[]): T {
  return arr[randInt(arr.length)];
}
