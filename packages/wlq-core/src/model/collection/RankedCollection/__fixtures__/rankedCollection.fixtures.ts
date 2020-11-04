import {
  RankedCollection,
  RankedCollectionItem,
  RankedCollectionQuestion
} from "..";
import rankedCollection from "./rankedCollection.fixture.json";

export const rankedCollectionFixture = (
  props: Partial<RankedCollection> = {}
): RankedCollection => ({
  ...(rankedCollection as RankedCollection),
  ...props
});

export const rankedCollectionItemFixture = (
  props: Partial<RankedCollectionItem> = {}
): RankedCollectionItem => ({
  type: "RankedCollectionItem",
  name: "Name",
  sets: ["set1"],
  rank: 1,
  quantity: 1,
  ...props
});

export const rankedQuestionFixture = (
  props: Partial<RankedCollectionQuestion> = {}
): RankedCollectionQuestion => ({
  type: "RankedMost",
  questionTextTemplate: "Text template",
  ...props
});
