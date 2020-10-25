import * as t from "io-ts";

const AddAnswerProps = {
  roomId: t.string,
  pid: t.string,
  answer: t.string
};

export const AddAnswerType = t.type(AddAnswerProps);
export type AddAnswer = t.TypeOf<typeof AddAnswerType>;
