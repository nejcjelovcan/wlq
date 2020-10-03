import { TaggedCollection, TaggedCollectionInfo } from '.'

const getTaggedCollectionInfo = (
  collection: TaggedCollection,
): TaggedCollectionInfo => {
  const tagLengths: { [tag: string]: number } = {}
  const tags = new Set<string>()
  for (const item of collection.items) {
    for (const tag of item.tags) {
      tagLengths[tag] = tagLengths[tag] ?? 0
      tagLengths[tag] += 1
      tags.add(tag)
    }
  }
  return {
    tagLengths,
    tags: [...tags],
  }
}

export default getTaggedCollectionInfo
