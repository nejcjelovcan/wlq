import { RoomPublic } from "@wlq/wlq-core/lib/model";
import { statemachine, Statemachine } from "overmind/lib/statemachine";

export type RoomStates = { current: "Empty" } | RoomPublic;

export type RoomEvents = { type: "LoadRoom"; data: { room: RoomPublic } };

export type RoomMachine = Statemachine<RoomStates, RoomEvents>;

export const roomMachine = statemachine<RoomStates, RoomEvents>({
  LoadRoom: (_, { room }) => room
});
