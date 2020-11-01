import * as t from "io-ts";
import {
  getPosedQuestionPublic,
  PosedQuestionCodec,
  PosedQuestionPublicCodec
} from "./PosedQuestion";
import { ParticipantAnswerCodec } from "../room/participant/ParticipantAnswer";

export const GameBaseCodec = t.type({
  type: t.literal("Game"),
  questionCount: t.number,
  questionIndex: t.number
});

export const GameQuestionCodec = t.type({
  question: PosedQuestionCodec,
  questionIndex: t.number,
  questionToken: t.string,
  answers: t.array(ParticipantAnswerCodec)
});
export type GameQuestion = t.TypeOf<typeof GameQuestionCodec>;

export const GamePublicQuestionCodec = t.type({
  question: PosedQuestionPublicCodec,
  answeredParticipants: t.array(t.string)
});
export type GamePublicQuestion = t.TypeOf<typeof GamePublicQuestionCodec>;

export const GamePublicAnswerCodec = t.type({
  answer: t.string,
  answers: t.array(ParticipantAnswerCodec)
});
export type GamePublicAnswer = t.TypeOf<typeof GamePublicAnswerCodec>;

export const GameCodec = t.intersection([
  GameBaseCodec,
  t.union([
    t.type({ current: t.literal("Idle") }),
    t.intersection([
      t.type({ current: t.literal("Question") }),
      GameQuestionCodec
    ]),
    t.intersection([
      t.type({ current: t.literal("Answer") }),
      GameQuestionCodec
    ]),
    t.type({ current: t.literal("Finished") })
  ])
]);
export type Game = t.TypeOf<typeof GameCodec>;

export const GamePublicCodec = t.intersection([
  GameBaseCodec,
  t.union([
    t.type({ current: t.literal("Idle") }),
    t.intersection([
      t.type({ current: t.literal("Question") }),
      GamePublicQuestionCodec
    ]),
    t.intersection([
      t.type({ current: t.literal("Answer") }),
      GamePublicQuestionCodec,
      GamePublicAnswerCodec
    ]),
    t.type({ current: t.literal("Finished") })
  ])
]);
export type GamePublic = t.TypeOf<typeof GamePublicCodec>;

export function getGamePublic(game: Game): GamePublic {
  if (game.current === "Question" || game.current === "Answer") {
    const { question, questionToken, answers, ...gamePublic } = game;

    const questionProps = {
      question: getPosedQuestionPublic(question),
      answeredParticipants: answers.map(a => a.pid)
    };

    if (game.current === "Question")
      return {
        ...gamePublic,
        ...questionProps,
        current: "Question"
      };

    if (game.current === "Answer")
      return {
        ...gamePublic,
        ...questionProps,
        current: "Answer",
        answers,
        answer: game.question.answer
      };
  }
  return game;
}
