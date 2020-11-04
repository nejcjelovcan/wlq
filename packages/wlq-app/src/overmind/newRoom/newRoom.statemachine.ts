import { IoErrors } from "@wlq/wlq-core";
import { NewRoom, RoomPublic } from "@wlq/wlq-core/lib/model";
import { json, statemachine, Statemachine } from "overmind";
import { RequestMachine } from "../request.statemachine";

export type NewRoomStates =
  | {
      current: "Partial";
      partialNewRoom: Partial<NewRoom>;
      errors: IoErrors;
    }
  | { current: "Valid"; validNewRoom: NewRoom }
  | { current: "Created"; room: RoomPublic };

export type NewRoomEvents =
  | {
      type: "NewRoomUpdate";
      data: { newRoom: Partial<NewRoom> };
    }
  | { type: "NewRoomValidate"; data: { newRoom: NewRoom } };
// | { type: "NewRoomErrors"; data: { errors: IoErrors } };

export type NewRoomBaseState = { request: RequestMachine };

export type NewRoomMachine = Statemachine<
  NewRoomStates,
  NewRoomEvents,
  NewRoomBaseState
>;

export function getNewRoom(
  state: NewRoomStates | NewRoomMachine
): Partial<NewRoom> {
  if (state.current === "Partial") return json(state.partialNewRoom);
  else if (state.current === "Valid") return json(state.validNewRoom);
  return {};
}

export const newRoomMachine = statemachine<
  NewRoomStates,
  NewRoomEvents,
  NewRoomBaseState
>({
  NewRoomUpdate: (_, { newRoom }) => ({
    current: "Partial",
    partialNewRoom: newRoom,
    errors: {}
  }),
  NewRoomValidate: (_, { newRoom }) => ({
    current: "Valid",
    validNewRoom: newRoom
  })
  // NewRoomErrors: (state, { errors }) => ({
  //   current: "Partial",
  //   partialNewRoom: getNewRoom(state),
  //   errors
  // })
});
