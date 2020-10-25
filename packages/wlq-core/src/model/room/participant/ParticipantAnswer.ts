import * as t from "io-ts";

export const ParticipantAnswerType = t.type({
  pid: t.string,
  answer: t.string
});

export type ParticipantAnswer = t.TypeOf<typeof ParticipantAnswerType>;
