import { CollectionItem } from "../Collection";

export interface Question {
  type: string;
  questionTextTemplate: string;
  helpTextTemplate?: string;
}

export interface PosedQuestion<I extends CollectionItem = CollectionItem> {
  questionText: string;
  options: I[];
  answer: I;
}

export type PosedQuestionPublic = {
  questionText: string;
  options: Pick<CollectionItem, "type" | "name">[];
};

export const getPosedQuestionPublic = <
  I extends CollectionItem = CollectionItem
>({
  questionText,
  options
}: PosedQuestion<I>): PosedQuestionPublic => ({
  questionText,
  options: options.map(({ type, name }) => ({ type, name }))
});
