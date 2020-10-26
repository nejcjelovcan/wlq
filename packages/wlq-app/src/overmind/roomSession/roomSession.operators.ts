import { RoomKey, RoomPublic } from "@wlq/wlq-core/lib/model";
import { mutate, Operator } from "overmind";

export const requestRoom: () => Operator<RoomKey> = () =>
  mutate(async function requestRoom({ state, effects: { rest } }, roomKey) {
    state.roomSession.send("RoomRequest", roomKey);
    const { room } = await rest.getRoom(roomKey);
    state.roomSession.send("RoomReceive", room);
  });

export const setRoom: () => Operator<RoomPublic> = () =>
  mutate(function setRoom({ state }, room) {
    state.roomSession.send("RoomReceive", room);
  });
