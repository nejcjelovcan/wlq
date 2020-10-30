import { statemachine, Statemachine } from "overmind";
import { SetParticipantsMessage } from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";
import { ErrorMessage } from "@wlq/wlq-core";
import { ParticipantPublic } from "@wlq/wlq-core/lib/model";
import { RequestMachine } from "../request.statemachine";
import { RoomMachine } from "./room/room.statemachine";

export type RoomSessionStates =
  | { current: "Init" }
  | { current: "Joining" }
  | { current: "Joined"; pid: string }
  | { current: "Error"; error: string };

export type RoomSessionEvents =
  // | { type: "Load" }
  | {
      type: "Join";
    }
  | { type: "Joined"; data: SetParticipantsMessage }
  | { type: "Error"; data: ErrorMessage };

export type RoomSessionBaseState = {
  request: RequestMachine;
  participants: ParticipantPublic[];
  room: RoomMachine;
};

export type RoomSessionMachine = Statemachine<
  RoomSessionStates,
  RoomSessionEvents,
  RoomSessionBaseState
>;

export const roomSessionMachine = statemachine<
  RoomSessionStates,
  RoomSessionEvents,
  RoomSessionBaseState
>({
  // Load: () => ({ current: "Loaded" }),
  Join: () => ({ current: "Joining" }),
  Joined: (_, { data: { participants, pid } }) => ({
    current: "Joined",
    participants,
    pid
  }),
  Error: (_, { data: { error } }) => ({ current: "Error", error })
});
