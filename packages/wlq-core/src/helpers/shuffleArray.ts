export default function shuffleArray<T>(arr: T[]): T[] {
  return arr.sort(() => Math.floor(Math.random() * Math.floor(3)) - 1);
}
