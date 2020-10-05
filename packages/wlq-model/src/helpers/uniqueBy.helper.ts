export const uniqueBy = <T extends object = { [key: string]: any }>(
  arr: T[],
  propName: string,
): T[] => {
  const set = new Set()
  const initial: T[] = []
  return arr.reduce((items, item) => {
    if (set.has(item[propName])) {
      return items
    }
    set.add(item[propName])
    return [...items, item]
  }, initial)
}
export default uniqueBy
