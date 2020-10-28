import { statemachine, Statemachine } from "overmind";
import { SetParticipantsMessage } from "@wlq/wlq-core/lib/api/room/JoinRoomMessages";
import { ErrorMessage } from "@wlq/wlq-core";
import { ParticipantPublic } from "@wlq/wlq-core/lib/model";
import { RequestMachine } from "../request.statemachine";
import { RoomMachine } from "./room.statemachine";

export type RoomSessionStates =
  | { current: "Init" }
  | { current: "Loaded" }
  | { current: "Joining" }
  | { current: "Joined" }
  | { current: "Error"; error: string };

export type RoomSessionEvents =
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
  Join: () => ({ current: "Joining" }),
  Joined: (_, { data: { participants } }) => ({
    current: "Joined",
    participants
  }),
  Error: (_, { data: { error } }) => ({ current: "Error", error })
});
