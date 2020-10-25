import {
  TaggedCollection,
  TaggedCollectionItem,
  TaggedCollectionQuestion
} from "..";
import taggedCollection from "./taggedCollection.fixture.json";

export const taggedCollectionFixture = (
  props: Partial<TaggedCollection> = {}
): TaggedCollection => ({
  ...(taggedCollection as TaggedCollection),
  ...props
});

export const taggedCollectionItemFixture = (
  props: Partial<TaggedCollectionItem> = {}
): TaggedCollectionItem => ({
  type: "TaggedCollectionItem",
  name: "Name",
  sets: ["set1"],
  tags: ["tag1"],
  ...props
});

export const taggedQuestionFixture = (
  props: Partial<TaggedCollectionQuestion> = {}
): TaggedCollectionQuestion => ({
  type: "TaggedPositive",
  questionTextTemplate: "Text template",
  ...props
});
