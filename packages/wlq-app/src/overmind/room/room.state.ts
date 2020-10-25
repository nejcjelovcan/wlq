import { statemachine } from "overmind";
import { NewRoom, RoomPublic } from "@wlq/wlq-core/lib/model";

export type RoomState =
  | { state: "Init" }
  | { state: "Requested"; roomId: string }
  | { state: "New"; newRoom: Partial<NewRoom>; valid: boolean }
  | { state: "Submitted"; newRoom: NewRoom; valid: boolean }
  | { state: "Room"; room: RoomPublic }
  | { state: "Joined"; room: RoomPublic }
  | { state: "Error"; roomId: string; error: string };

export const state = statemachine<RoomState>(
  {
    Init: ["Requested", "New"],
    New: ["Submitted"],
    Submitted: ["Room", "Error"],
    Requested: ["Room", "Error"],
    Room: ["Joined", "Init", "Requested", "Error"],
    Joined: ["Init", "Room", "Requested"],
    Error: ["Init"]
  },
  {
    state: "Init"
  }
);
