import { Collection, CollectionItem, Question } from "..";

export interface RankedCollection extends Collection<RankedCollectionItem> {
  type: "RankedCollection";
  questions: RankedCollectionQuestion[];
}

export interface RankedCollectionItem extends CollectionItem {
  type: "RankedCollectionItem";
  rank: number;
  quantity: number | string;
}

export interface RankedCollectionQuestion extends Question {
  type: "RankedLeast" | "RankedMost";
}

export { default as prepareRankedCollections } from "./prepareRankedCollections";
