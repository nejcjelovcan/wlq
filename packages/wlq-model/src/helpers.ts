export const randInt = (l: number) => Math.floor(Math.random() * l)

export const sample = <T>(arr: T[]): T => arr[randInt(arr.length)]

export const sampleMany = <T>(arr: T[], count: number): T[] => {
  const set = new Set<number>()
  if (arr.length < count) {
    console.error('Invalid array size', count, arr)
    throw new Error('Invalid array size')
  }
  while (set.size < count) {
    set.add(randInt(arr.length))
  }
  return [...set].map(i => arr[i])
}

export const shuffleArray = <T>(arr: T[]) =>
  arr.sort(() => Math.floor(Math.random() * Math.floor(3)) - 1)

export const getIndefiniteArticle = (word: string) =>
  /^(a|e|i|o|u)/i.test(word) ? 'an' : 'a'
