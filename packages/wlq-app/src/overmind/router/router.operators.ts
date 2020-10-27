import { map, mutate, Operator } from "overmind";
import { IParams } from "./router.effects";
import { RouterPage } from "./router.state";

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

export const goToRoom: () => Operator = () =>
  map(
    ({
      state: { roomSession },
      effects: {
        router: { open }
      }
    }) => {
      if (roomSession.current === "Loaded") {
        open(`/room/${roomSession.room.roomId}`);
      }
    }
  );
