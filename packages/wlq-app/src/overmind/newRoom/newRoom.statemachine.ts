import { decodeOptional } from "@wlq/wlq-core";
import { NewRoom, NewRoomCodec, RoomPublic } from "@wlq/wlq-core/lib/model";
import { json, statemachine, Statemachine } from "overmind";

export type NewRoomStates =
  | { current: "Editing"; valid: boolean }
  | { current: "Submitting" }
  | { current: "Created"; room: RoomPublic }
  | { current: "Error"; error: string };

export type NewRoomBaseState = { newRoomData: Partial<NewRoom> };

export type NewRoomEvents =
  | { type: "NewRoomUpdate"; data: { newRoomData: Partial<NewRoom> } }
  | { type: "NewRoomSubmit" }
  | { type: "NewRoomReceive"; data: { room: RoomPublic } }
  | { type: "NewRoomError"; data: { error: string } };

export type NewRoomMachine = Statemachine<
  NewRoomStates,
  NewRoomEvents,
  NewRoomBaseState
>;
export const newRoomMachine = statemachine<
  NewRoomStates,
  NewRoomEvents,
  NewRoomBaseState
>({
  NewRoomUpdate: (state, { newRoomData }) => {
    const data = { ...state.newRoomData, ...newRoomData };
    const validated = decodeOptional(NewRoomCodec, data);
    return {
      current: "Editing",
      newRoomData: validated ?? data,
      valid: Boolean(validated)
    };
  },
  NewRoomSubmit: state => {
    if (state.current !== "Submitting") {
      return { current: "Submitting", newRoomData: json(state.newRoomData) };
    }
    return;
  },
  NewRoomReceive: (state, { room }) => {
    if (state.current === "Submitting") {
      return {
        current: "Created",
        newRoomData: json(state.newRoomData),
        room
      };
    }
    return;
  },
  NewRoomError: (state, { error }) => {
    return { current: "Error", error, newRoomData: json(state.newRoomData) };
  }
});
