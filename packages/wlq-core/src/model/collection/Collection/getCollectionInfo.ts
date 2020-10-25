import { Collection, CollectionInfo } from ".";

const getCollectionInfo = ({ items }: Collection): CollectionInfo => {
  return { itemsLength: items.length };
};
export default getCollectionInfo;
