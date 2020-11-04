import randInt from "./randInt";

export default function sample<T>(arr: Readonly<T[]>): T {
  return arr[randInt(arr.length)];
}
