export default function uniqueBy<T extends object = { [key: string]: unknown }>(
  arr: T[],
  propName: keyof T
): T[] {
  const set = new Set();
  const initial: T[] = [];
  return arr.reduce((items, item) => {
    if (set.has(item[propName])) {
      return items;
    }
    set.add(item[propName]);
    return [...items, item];
  }, initial);
}
