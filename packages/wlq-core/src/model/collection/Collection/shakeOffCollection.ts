import { Collection } from ".";
import getCollectionInfo from "./getCollectionInfo";

const COLLECTION_MIN_ITEMS = 8;

// remove questions for collections that don't have enough items
const shakeOffCollection = <C extends Collection = Collection>(
  collection: C,
  minItems = COLLECTION_MIN_ITEMS
): C => {
  const info = getCollectionInfo(collection);
  return {
    ...collection,
    questions: info.itemsLength < minItems ? [] : collection.questions
  };
};
export default shakeOffCollection;
