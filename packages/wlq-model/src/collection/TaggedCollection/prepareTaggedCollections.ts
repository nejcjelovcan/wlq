import { TaggedCollection } from '.'
import { filterCollectionItemsBySets, shakeOffCollection } from '../Collection'
import shakeOffTaggedCollection from './shakeOffTaggedCollection'

// Prepare list of tagged collections for given sets
// This will filter out items that are not in the set and then proceed to
// remove questions that are no longer possible (and filter out collections
// that end up with no questions)
const prepareTaggedCollections = ({
  collections,
  sets,
  minItems,
  minNegativeQuestionTagItems,
}: {
  collections: TaggedCollection[]
  sets?: string[]
  minItems?: number
  minNegativeQuestionTagItems?: number
}) => {
  return collections
    .map(collection =>
      shakeOffTaggedCollection(
        shakeOffCollection(
          filterCollectionItemsBySets(collection, sets ?? []),
          minItems,
        ),
        minNegativeQuestionTagItems,
      ),
    )
    .filter(collection => collection.questions.length > 0)
}
export default prepareTaggedCollections
