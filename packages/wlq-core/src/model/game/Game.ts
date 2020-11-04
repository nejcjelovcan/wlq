import * as t from "io-ts";
import {
  getPosedQuestionPublic,
  PosedQuestionCodec,
  PosedQuestionPublicCodec
} from "./PosedQuestion";
import {
  ParticipantAnswer,
  ParticipantAnswerCodec
} from "../room/participant/ParticipantAnswer";
import { ParticipantPublic } from "../room/participant/Participant";

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
  answeredParticipants: t.array(t.string),
  answers: t.array(ParticipantAnswerCodec)
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
        current: "Question",
        answers: [] // TODO test this
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

export function hasParticipantAnswered(
  game: Game | GamePublic,
  pid: string
): boolean {
  const answer = getParticipantAnswer(game, pid);
  if (answer) return true;
  if (
    game.current === "Question" &&
    "answeredParticipants" in game &&
    Array.isArray(game.answeredParticipants)
  ) {
    // @ts-ignore
    return game.answeredParticipants.includes(pid);
  }
  return false;
}

export function getParticipantAnswer(
  game: Game | GamePublic,
  pid: string
): ParticipantAnswer | null {
  if (game.current === "Question" || game.current === "Answer") {
    return game.answers.find(a => a.pid === pid) || null;
  }
  return null;
}

export type ParticipantsByAnswer = { [answer: string]: ParticipantPublic[] };

export function getParticipantsByAnswer(
  game: GamePublic,
  participants: ParticipantPublic[]
): ParticipantsByAnswer {
  if (game.current === "Answer") {
    return game.answers
      .map<[string, ParticipantPublic | undefined]>(({ answer, pid }) => [
        answer,
        participants.find(p => p.pid === pid)
      ])
      .reduce<ParticipantsByAnswer>((aggregate, [answer, participant]) => {
        if (!(answer in aggregate)) {
          aggregate[answer] = [];
        }
        if (participant) {
          aggregate[answer].push(participant);
        }
        return aggregate;
      }, {});
  }
  return {};
}
