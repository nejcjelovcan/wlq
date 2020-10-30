import { sample } from "../../helpers";
import {
  Collection,
  poseRankedQuestion,
  poseTaggedQuestion,
  prepareRankedCollections,
  prepareTaggedCollections,
  RankedCollection,
  TaggedCollection
} from "../../model/collection";
import { PosedQuestion } from "../../model/game/PosedQuestion";
import rankedCollections from "./geography.ranked.collections.json";
import taggedCollections from "./geography.tagged.collections.json";

export const getAllCollections = (): Collection[] => [
  ...prepareTaggedCollections({
    collections: taggedCollections as TaggedCollection[]
  }),
  ...prepareRankedCollections({
    collections: rankedCollections as RankedCollection[]
  })
];

export const poseQuestion = (collections: Collection[]): PosedQuestion => {
  const collection = sample(collections);
  switch (collection.type) {
    case "RankedCollection":
      return poseRankedQuestion(collection as RankedCollection);

    case "TaggedCollection":
      return poseTaggedQuestion(collection as TaggedCollection);
  }
};
