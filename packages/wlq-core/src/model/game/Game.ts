import * as t from "io-ts";
import { PosedQuestionType } from "./PosedQuestion";
import { ParticipantAnswerType } from "../room/participant/ParticipantAnswer";

export const GameQuestionCodec = t.type({
  question: PosedQuestionType,
  questionIndex: t.number,
  questionToken: t.string,
  answers: t.array(ParticipantAnswerType)
});
export type GameQuestion = t.TypeOf<typeof GameQuestionCodec>;

export const GamePublicQuestionCodec = t.type({
  questionText: t.string,
  questionOptions: t.array(t.string),
  answeredParticipants: t.array(t.string)
});
export type GamePublicQuestion = t.TypeOf<typeof GamePublicQuestionCodec>;

export const GamePublicAnswerCodec = t.type({
  answers: t.array(ParticipantAnswerType)
});
export type GamePublicAnswer = t.TypeOf<typeof GamePublicAnswerCodec>;

export const GameCodec = t.intersection([
  t.type({
    type: t.literal("Game"),
    questionCount: t.number,
    roomId: t.string
  }),
  t.union([
    t.type({ state: t.literal("Idle") }),
    t.intersection([
      t.type({ state: t.literal("Question") }),
      GameQuestionCodec
    ]),
    t.intersection([t.type({ state: t.literal("Answer") }), GameQuestionCodec]),
    t.type({ state: t.literal("Finished") })
  ])
]);
export type Game = t.TypeOf<typeof GameCodec>;

export const GamePublicCodec = t.intersection([
  t.type({
    type: t.literal("Game"),
    questionCount: t.number,
    roomId: t.string
  }),
  t.union([
    t.type({ state: t.literal("Idle") }),
    t.intersection([
      t.type({ state: t.literal("Question") }),
      GamePublicQuestionCodec
    ]),
    t.intersection([
      t.type({ state: t.literal("Answer") }),
      GamePublicQuestionCodec,
      GamePublicAnswerCodec
    ]),
    t.type({ state: t.literal("Finished") })
  ])
]);
export type GamePublic = t.TypeOf<typeof GamePublicCodec>;

export function getGamePublic(game: Game): GamePublic {
  if (game.state === "Question" || game.state === "Answer") {
    const {
      question: { options, questionText },
      questionToken,
      answers,
      ...gamePublic
    } = game;

    const questionProps = {
      questionOptions: options,
      questionText,
      answeredParticipants: answers.map(a => a.pid)
    };

    if (game.state === "Question")
      return {
        ...gamePublic,
        ...questionProps,
        state: "Question"
      };

    if (game.state === "Answer")
      return {
        ...gamePublic,
        ...questionProps,
        state: "Answer",
        answers
      };
  }
  return game;
}
