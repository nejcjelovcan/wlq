import {
  ParticipantPublic,
  RoomKey,
  RoomPublic
} from "@wlq/wlq-core/lib/model";
import { json, statemachine, Statemachine } from "overmind";
import { SetParticipantsMessage } from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";

export type RoomSessionStates =
  | { current: "Init" }
  | { current: "Requesting"; roomId: string }
  | { current: "Loaded"; room: RoomPublic }
  | { current: "Joining"; room: RoomPublic }
  | { current: "Joined"; room: RoomPublic; participants: ParticipantPublic[] }
  | { current: "Error"; error: string };

export type RoomSessionEvents =
  | { type: "RoomRequest"; data: RoomKey }
  | { type: "RoomReceive"; data: RoomPublic }
  | { type: "RoomJoin" }
  | { type: "RoomJoined"; data: SetParticipantsMessage }
  | { type: "RoomError"; data: { error: string } };

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
      current: "Requesting",
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
  },
  RoomError: (_, { error }) => {
    return { current: "Error", error };
  }
});
