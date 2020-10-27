import { decodeThrow } from "@wlq/wlq-core";
import {
  JoinRoomMessage,
  SetParticipantsMessage,
  SetParticipantsMessageCodec
} from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";
import { RoomKey, RoomPublic } from "@wlq/wlq-core/lib/model";
import { mutate, Operator, pipe } from "overmind";
import { goToRoom } from "../router/router.operators";
import * as o from "./roomSession.operators";

export const requestRoom: Operator<RoomKey> = pipe(
  o.shouldRequestRoom(),
  o.requestRoom(),
  o.openWebsocket(),
  o.handleRoomError()
);
export const setRoom: Operator<RoomPublic> = pipe(
  o.setRoom(),
  goToRoom(),
  o.openWebsocket()
);

export const onSetParticipants: Operator<SetParticipantsMessage> = mutate(
  ({ state: { roomSession } }, message) => {
    roomSession.send("RoomJoined", message);
  }
);

export const joinRoom: Operator = mutate(
  ({ state: { token, user, roomSession }, effects: { websocket } }) => {
    if (
      token.current === "Loaded" &&
      user.current === "Valid" &&
      roomSession.current === "Joining"
    ) {
      websocket.sendMessage<JoinRoomMessage>({
        action: "joinRoom",
        data: {
          token: token.token,
          details: user.details,
          roomId: roomSession.room.roomId
        }
      });
    }
  }
);

export const receiveMessage: Operator<MessageEvent> = pipe(
  o.getWebsocketMessage(),
  mutate(
    (
      {
        actions: {
          roomSession: { onSetParticipants }
        }
      },
      message
    ) => {
      if (message) {
        switch (message.action) {
          case "setParticipants":
            onSetParticipants(
              decodeThrow(SetParticipantsMessageCodec, message)
            );
            break;
        }
      }
    }
  )
);
