import { mutate, Operator } from "overmind";
import { IParams } from "./router.effects";
import { RouterPage } from "./router.state";

// export const route
export const test = () => {};

// export const setPage = <T>(page: "Index"|"Settings"|"New") => Operator<T> = page => mutate({})

export const setPage: (name: RouterPage["name"]) => Operator<IParams> = name =>
  mutate(function setPage({ state }, params) {
    if (name === "Settings") {
      state.router.currentPage = {
        name,
        next: params && params.next ? params.next : null
      };
    } else if (name === "Room") {
      const roomId = params && params.roomId ? params.roomId : null;
      if (!roomId) {
        state.router.currentPage = { name: "New" };
      } else {
        state.router.currentPage = { name: "Room", roomId };
      }
    } else {
      state.router.currentPage = { name };
    }
  });
