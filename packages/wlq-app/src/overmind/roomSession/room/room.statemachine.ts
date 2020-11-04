import { GameFinishedMessage } from "@wlq/wlq-core/lib/api/game/NextQuestionMessages";
import { RevealAnswerMessage } from "@wlq/wlq-core/lib/api/game/revealAnswer";
import { ParticipantAnsweredMessage } from "@wlq/wlq-core/lib/api/game/answerQuestion.websocket";
import {
  ParticipantAnswer,
  PosedQuestionPublic,
  RoomPublic
} from "@wlq/wlq-core/lib/model";
import { statemachine, Statemachine } from "overmind/lib/statemachine";

export type RoomStates = { current: "Empty" } | RoomPublic;

export type RoomEvents =
  | { type: "LoadRoom"; data: { room: RoomPublic } }
  | { type: "PoseQuestion"; data: { question: PosedQuestionPublic } }
  | { type: "RevealAnswer"; data: RevealAnswerMessage["data"] }
  | { type: "GameFinished"; data: GameFinishedMessage["data"] }
  | { type: "ParticipantAnswered"; data: ParticipantAnsweredMessage["data"] }
  | { type: "AnswerQuestion"; data: ParticipantAnswer };

export type RoomMachine = Statemachine<RoomStates, RoomEvents>;

export const roomMachine = statemachine<RoomStates, RoomEvents>({
  LoadRoom: (_, { room }) => room,
  PoseQuestion: (state, { question }) => {
    if (state.current === "Game") {
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          ...state.game,
          current: "Question",
          question,
          answeredParticipants: [],
          answers: []
        }
      };
    } else if (state.current === "Idle") {
      // game just started
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          type: "Game",
          current: "Question",
          questionCount: 10,
          questionIndex: 0,
          question,
          answeredParticipants: [],
          answers: []
        }
      };
    }
    throw new Error("Invalid state in PoseQuestion");
  },
  RevealAnswer: (state, { answer, answers }) => {
    if (state.current === "Game" && state.game.current === "Question") {
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          ...state.game,
          current: "Answer",
          answers,
          answer
        }
      };
    }
    throw new Error("Invalid state in RevealAnswer");
  },
  ParticipantAnswered: (state, { pid }) => {
    if (
      state.current === "Game" &&
      // it happens sometime that answer is revealed before participantAnswer
      // is received (so we need current === "Answer as well")
      (state.game.current === "Question" || state.game.current === "Answer")
    ) {
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          ...state.game,
          answeredParticipants: state.game.answeredParticipants.concat([pid])
        }
      };
    }
    throw new Error("Invalid state in ParticipantAnswered");
  },
  GameFinished: state => {
    if (state.current === "Game") {
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          ...state.game,
          current: "Finished"
        }
      };
    }
    throw new Error("Invalid state in GameFinished");
  },
  AnswerQuestion: (state, { pid, answer }) => {
    if (state.current === "Game" && state.game.current === "Question") {
      return {
        ...getRoomProps(state),
        current: "Game",
        game: {
          ...state.game,
          answers: state.game.answers.concat([{ pid, answer }])
        }
      };
    }
    throw new Error("Invalid state in AnswerQuestion");
  }
});

function getRoomProps({
  type,
  websocket,
  listed,
  participantCount,
  roomId
}: RoomPublic): Pick<
  RoomPublic,
  "type" | "websocket" | "listed" | "participantCount" | "roomId"
> {
  return {
    type,
    websocket,
    listed,
    participantCount,
    roomId
  };
}
