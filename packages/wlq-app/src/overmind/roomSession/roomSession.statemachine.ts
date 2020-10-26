import {
  ParticipantPublic,
  RoomKey,
  RoomPublic
} from "@wlq/wlq-core/lib/model";
import { json, statemachine, Statemachine } from "overmind";
import { SetParticipantsMessage } from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";

export type RoomSessionStates =
  | { current: "Init" }
  | { current: "Requested"; roomId: string }
  | { current: "Loaded"; room: RoomPublic }
  | { current: "Joining"; room: RoomPublic }
  | { current: "Joined"; room: RoomPublic; participants: ParticipantPublic[] };

export type RoomSessionEvents =
  | { type: "RoomRequest"; data: RoomKey }
  | { type: "RoomReceive"; data: RoomPublic }
  | { type: "RoomJoin" }
  | { type: "RoomJoined"; data: SetParticipantsMessage };

export type RoomSessionMachine = Statemachine<
  RoomSessionStates,
  RoomSessionEvents
>;
export const roomSessionMachine = statemachine<
  RoomSessionStates,
  RoomSessionEvents
>({
  RoomRequest: (_, { roomId }) => {
    return {
      current: "Requested",
      roomId
    };
  },
  RoomReceive: (_, room) => {
    return {
      current: "Loaded",
      room
    };
  },
  RoomJoin: state => {
    if (state.current === "Loaded") {
      return {
        current: "Joining",
        room: json(state.room)
      };
    }
    return;
  },
  RoomJoined: (state, message) => {
    if (state.current === "Joining") {
      return {
        current: "Joined",
        room: json(state.room),
        participants: message.data.participants
      };
    }
    return;
  }
});
