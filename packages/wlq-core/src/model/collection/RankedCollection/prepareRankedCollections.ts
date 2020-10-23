import { RankedCollection } from ".";
import { filterCollectionItemsBySets, shakeOffCollection } from "../Collection";

// Preparing ranked collections could also include sorting them by rank
// For now, we generate ranked dataset with items already sorted
const prepareRankedCollections = ({
  collections,
  sets,
  minItems
}: {
  collections: RankedCollection[];
  sets?: string[];
  minItems?: number;
}) => {
  return collections
    .map(collection =>
      shakeOffCollection(
        filterCollectionItemsBySets(collection, sets ?? []),
        minItems
      )
    )
    .filter(collection => collection.questions.length > 0);
};
export default prepareRankedCollections;
