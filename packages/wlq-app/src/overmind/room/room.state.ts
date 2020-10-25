import { statemachine } from "overmind";
import { RoomPublic } from "@wlq/wlq-core/lib/model";

export type RoomState =
  | { state: "Init" }
  | { state: "Requested"; roomId: string }
  | { state: "Room"; room: RoomPublic }
  | { state: "Joined"; room: RoomPublic };

export const state = statemachine<RoomState>(
  {
    Init: ["Requested"],
    Requested: ["Room"],
    Room: ["Joined", "Init", "Requested"],
    Joined: ["Init", "Room", "Requested"]
  },
  {
    state: "Init"
  }
);
