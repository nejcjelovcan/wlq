export default function getIndefiniteArticle(word: string) {
  return /^(a|e|i|o|u)/i.test(word) ? "an" : "a";
}
