import { decodeThrow, IWebsocketMessage } from "@wlq/wlq-core";
import {
  ParticipantAnsweredMessage,
  ParticipantAnsweredMessageCodec
} from "@wlq/wlq-core/lib/api/game/answerQuestion.websocket";
import {
  GameFinishedMessage,
  GameFinishedMessageCodec,
  PoseQuestionMessage,
  PoseQuestionMessageCodec
} from "@wlq/wlq-core/lib/api/game/NextQuestionMessages";
import {
  RevealAnswerMessage,
  RevealAnswerMessageCodec
} from "@wlq/wlq-core/lib/api/game/revealAnswer";
import {
  JoinRoomMessage,
  ParticipantJoinedMessage,
  ParticipantJoinedMessageCodec,
  SetParticipantsMessage,
  SetParticipantsMessageCodec
} from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";
import {
  ParticipantLeftMessage,
  ParticipantLeftMessageCodec
} from "@wlq/wlq-core/lib/api/room/leaveRoom.websocket";
import { map, Operator, pipe, run } from "overmind";
import {
  sendGameFinished,
  sendParticipantAnswered,
  sendPoseQuestion,
  sendRevealAnswer
} from "./room/room.operators";
import * as o from "./roomSession.operators";

/* === Websocket sends === */

export const joinRoom = run(({ state, effects: { websocket } }) => {
  if (
    state.token.current === "Loaded" &&
    state.user.current === "Valid" &&
    state.current === "Room" &&
    state.roomSession.room.current !== "Empty"
  ) {
    websocket.sendMessage<JoinRoomMessage>({
      action: "joinRoom",
      data: {
        token: state.token.token,
        details: state.user.validDetails,
        roomId: state.roomSession.room.roomId
      }
    });
  }
});

export const startGame = run(({ state, effects: { websocket } }) => {
  if (state.current === "Room" && state.roomSession.current === "Joined") {
    websocket.sendMessage({ action: "startGame", data: {} });
  }
});

/* === Websocket messages === */

export const setParticipants: Operator<SetParticipantsMessage> = pipe(
  o.sendJoined(),
  map((_, { data: { participants } }) => participants),
  o.updateParticipants()
);

export const participantJoined: Operator<ParticipantJoinedMessage> = pipe(
  map(({ state }, { data: { participant } }) => {
    if (state.current === "Room") {
      return [...state.roomSession.participants].concat([participant]);
    }
    throw new Error("Unexpected state");
  }),
  o.updateParticipants()
);

export const participantLeft: Operator<ParticipantLeftMessage> = pipe(
  map(({ state }, { data: { pid } }) => {
    if (state.current === "Room") {
      return state.roomSession.participants.filter(p => p.pid !== pid);
    }
    return [];
  }),
  o.updateParticipants()
);

export const poseQuestion: Operator<PoseQuestionMessage> = pipe(
  o.getMessageData(),
  sendPoseQuestion()
);

export const participantAnswered: Operator<ParticipantAnsweredMessage> = pipe(
  o.getMessageData(),
  sendParticipantAnswered()
);

export const revealAnswer: Operator<RevealAnswerMessage> = pipe(
  o.getMessageData(),
  sendRevealAnswer()
);

export const gameFinished: Operator<GameFinishedMessage> = pipe(
  o.getMessageData(),
  sendGameFinished()
);

/* === Websocket === */

export const roomOnMessage: Operator<MessageEvent, IWebsocketMessage> = pipe(
  o.getMessage(),
  run(function roomOnMessage(
    {
      actions: {
        roomSession: {
          setParticipants,
          participantJoined,
          participantLeft,
          poseQuestion,
          revealAnswer,
          participantAnswered,
          gameFinished
        }
      }
    },
    message
  ) {
    switch (message.action) {
      case "setParticipants":
        setParticipants(decodeThrow(SetParticipantsMessageCodec, message));
        break;
      case "participantJoined":
        participantJoined(decodeThrow(ParticipantJoinedMessageCodec, message));
        break;
      case "participantLeft":
        participantLeft(decodeThrow(ParticipantLeftMessageCodec, message));
        break;
      case "poseQuestion":
        poseQuestion(decodeThrow(PoseQuestionMessageCodec, message));
        break;
      case "revealAnswer":
        revealAnswer(decodeThrow(RevealAnswerMessageCodec, message));
        break;
      case "participantAnswered":
        participantAnswered(
          decodeThrow(ParticipantAnsweredMessageCodec, message)
        );
        break;
      case "gameFinished":
        gameFinished(decodeThrow(GameFinishedMessageCodec, message));
        break;
      default:
        throw new Error(
          `Unhandled websocket message: ${JSON.stringify(message)}`
        );
    }
  })
);
