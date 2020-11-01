import { decodeThrow, IWebsocketMessage, uniqueBy } from "@wlq/wlq-core";
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
import { mutate, Operator, pipe, run } from "overmind";
import * as o from "./roomSession.operators";

export const setParticipants: Operator<SetParticipantsMessage> = o.sendJoined();

export const participantJoined: Operator<ParticipantJoinedMessage> = mutate(
  ({ state }, { data: { participant } }) => {
    if (state.current === "Room") {
      state.roomSession.participants = uniqueBy(
        [...state.roomSession.participants].concat([participant]),
        "pid"
      );
    }
  }
);

export const participantLeft: Operator<ParticipantLeftMessage> = mutate(
  ({ state }, { data: { pid } }) => {
    if (state.current === "Room") {
      state.roomSession.participants = state.roomSession.participants.filter(
        p => p.pid !== pid
      );
    }
  }
);

export const roomOnMessage: Operator<MessageEvent, IWebsocketMessage> = pipe(
  o.getMessage(),
  mutate(function roomOnMessage(
    {
      actions: {
        roomSession: { setParticipants, participantJoined, participantLeft }
      }
    },
    message
  ) {
    if (message.action === "setParticipants") {
      const decoded = decodeThrow(SetParticipantsMessageCodec, message);
      setParticipants(decoded);
    } else if (message.action === "participantJoined") {
      const decoded = decodeThrow(ParticipantJoinedMessageCodec, message);
      participantJoined(decoded);
    } else if (message.action === "participantLeft") {
      const decoded = decodeThrow(ParticipantLeftMessageCodec, message);
      participantLeft(decoded);
    } else {
      throw new Error(
        `Unhandled websocket message: ${JSON.stringify(message)}`
      );
    }
  })
);

export const joinRoom: Operator = run(({ state, effects: { websocket } }) => {
  if (
    state.token.current === "Loaded" &&
    state.user.current === "Valid" &&
    state.current === "Room" &&
    state.roomSession.room.current !== "Empty"
  ) {
    const message: JoinRoomMessage = {
      action: "joinRoom",
      data: {
        token: state.token.token,
        details: state.user.validDetails,
        roomId: state.roomSession.room.roomId
      }
    };
    websocket.sendMessage(message);
  }
});
