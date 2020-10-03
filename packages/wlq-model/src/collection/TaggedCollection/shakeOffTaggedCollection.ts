import { TaggedCollection } from '.'
import getTaggedCollectionInfo from './getTaggedCollectionInfo'

const TAGGED_COLLECTION_MIN_NEGATIVE_QUESTION_TAG_ITEMS = 4

// Sets .possibleTags on all questions
// (For TaggedNegative questions possibleTags are those that have more than
// minTagItems items)
// Questions with 0 possibleTags are removed
const shakeOffTaggedCollection = (
  collection: TaggedCollection,
  minNegativeQuestionTagItems = TAGGED_COLLECTION_MIN_NEGATIVE_QUESTION_TAG_ITEMS,
): TaggedCollection => {
  const { tagLengths } = getTaggedCollectionInfo(collection)
  return {
    ...collection,
    questions: collection.questions
      .map(q => {
        const possibleTags = Object.entries(tagLengths)
          .filter(([, length]) =>
            q.type === 'TaggedNegative'
              ? length >= minNegativeQuestionTagItems
              : true,
          )
          .map(([tagName]) => tagName)
        return { ...q, possibleTags }
      })
      .filter(q => q.possibleTags!.length > 0),
  }
}
export default shakeOffTaggedCollection
