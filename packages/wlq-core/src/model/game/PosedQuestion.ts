import * as t from "io-ts";

const PosedQuestionPublicProps = {
  type: t.literal("PosedQuestion"),
  questionText: t.string,
  options: t.array(t.string),
  time: t.number
};

export const PosedQuestionCodec = t.type({
  ...PosedQuestionPublicProps,
  answer: t.string
});
export type PosedQuestion = t.TypeOf<typeof PosedQuestionCodec>;

export const PosedQuestionPublicCodec = t.type(PosedQuestionPublicProps);
export type PosedQuestionPublic = t.TypeOf<typeof PosedQuestionPublicCodec>;

export function getPosedQuestionPublic({
  answer,
  ...publicRest
}: PosedQuestion): PosedQuestionPublic {
  return publicRest;
}
