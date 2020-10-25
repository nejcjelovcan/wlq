import { Collection, CollectionItem } from "..";
import { Question } from "../../Question";
import {
  taggedCollectionFixture,
  taggedQuestionFixture
} from "../../TaggedCollection/__fixtures__/taggedCollection.fixtures";

export const collectionFixture = (
  props: Partial<Collection> = {}
): Collection => ({ ...taggedCollectionFixture(), ...props });

export const collectionItemFixture = (
  props: Partial<CollectionItem> = {}
): CollectionItem => ({
  type: "CollectionItem",
  name: "Name",
  sets: ["set1"],
  ...props
});

export const questionFixture = (props: Partial<Question> = {}): Question => ({
  ...taggedQuestionFixture(),
  ...props
});
