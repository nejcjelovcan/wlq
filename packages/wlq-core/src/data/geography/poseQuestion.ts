import { sample } from "../../helpers";
import { PosedQuestion } from "../../model";
import {
  Collection,
  poseRankedQuestion,
  poseTaggedQuestion,
  RankedCollection,
  TaggedCollection
} from "../../model/collection";

export const poseQuestion = (collections: Collection[]): PosedQuestion => {
  const collection = sample(collections);
  switch (collection.type) {
    case "RankedCollection":
      return poseRankedQuestion(collection as RankedCollection);

    case "TaggedCollection":
      return poseTaggedQuestion(collection as TaggedCollection);
  }
};
