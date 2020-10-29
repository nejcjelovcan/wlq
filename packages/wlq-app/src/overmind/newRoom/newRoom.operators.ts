import { NewRoom } from "@wlq/wlq-core/lib/model";
import { map, mutate, Operator, pipe } from "overmind";
import { getNewRoom } from "./newRoom.statemachine";

export const sendNewRoomUpdate: () => Operator<Partial<NewRoom>> = () =>
  pipe(
    mutate(({ state }, newRoom) => {
      if (state.current !== "New") throw new Error("Unexpected state");
      state.newRoom.send("NewRoomUpdate", { newRoom });
    }),
    map(({ state }) => {
      if (state.current !== "New") throw new Error("Unexpected state");
      return getNewRoom(state.newRoom);
    })
  );

export const sendNewRoomValid: () => Operator<NewRoom> = () =>
  mutate(({ state }, newRoom) => {
    if (state.current !== "New") throw new Error("Unexpected state");
    state.newRoom.send("NewRoomValidate", { newRoom });
  });

export const sendRequest: <T>() => Operator<T> = () =>
  mutate(function sendRequest({ state }) {
    if (state.current === "New") {
      state.newRoom.request.send("Request");
    }
  });

export const sendReceive: <T>() => Operator<T> = () =>
  mutate(function sendReceive({ state }) {
    if (state.current === "New") {
      state.newRoom.request.send("Response");
    }
  });

export const sendError: () => Operator<Error> = () =>
  mutate(function sendError({ state }, error) {
    if (state.current === "New") {
      state.newRoom.request.send("Error", { error: error.message });
    }
  });
