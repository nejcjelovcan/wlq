import {
  Collection,
  prepareRankedCollections,
  prepareTaggedCollections,
  RankedCollection,
  TaggedCollection
} from "../../model/collection";
import rankedCollections from "./geography.ranked.collections.json";
import taggedCollections from "./geography.tagged.collections.json";
export { poseQuestion } from "./poseQuestion";

export const getAllCollections = (): Collection[] => [
  ...prepareTaggedCollections({
    collections: taggedCollections as TaggedCollection[]
  }),
  ...prepareRankedCollections({
    collections: rankedCollections as RankedCollection[]
  })
];
