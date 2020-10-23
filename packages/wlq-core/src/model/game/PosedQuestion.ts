import * as t from "io-ts";

const PosedQuestionPublicProps = {
  type: t.literal("PosedQuestion"),
  questionText: t.string,
  options: t.array(t.string)
};

export const PosedQuestionType = t.type({
  ...PosedQuestionPublicProps,
  answer: t.string
});
export type PosedQuestion = t.TypeOf<typeof PosedQuestionType>;

export const PosedQuestionPublicType = t.type(PosedQuestionPublicProps);
export type PosedQuestionPublic = t.TypeOf<typeof PosedQuestionPublicType>;
