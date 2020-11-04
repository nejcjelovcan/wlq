import randInt from "./randInt";

export class InvalidArraySizeError extends Error {}

export default function sampleMany<T>(arr: T[], count: number): T[] {
  const set = new Set<number>();
  if (arr.length < count) {
    throw new InvalidArraySizeError("Invalid array size");
  }
  while (set.size < count) {
    set.add(randInt(arr.length));
  }
  return [...set].map(i => arr[i]);
}
