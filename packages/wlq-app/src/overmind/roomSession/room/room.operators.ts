import { RoomPublic } from "@wlq/wlq-core/lib/model";
import { mutate, Operator } from "overmind";

export const sendLoadRoom: () => Operator<{ room: RoomPublic }> = () =>
  mutate(function sendLoadRoom({ state }, { room }) {
    if (state.current === "Room") {
      state.roomSession.room.send("LoadRoom", { room });
    }
  });
