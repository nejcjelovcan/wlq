import { NewRoom } from "@wlq/wlq-core/lib/model";
import { debounce, mutate, Operator, pipe } from "overmind";
import * as o from "./newRoom.operators";

export const updateNewRoomData: Operator<Partial<NewRoom>> = pipe(
  debounce(200),
  mutate(({ state: { newRoom } }, newRoomData) => {
    newRoom.send("NewRoomUpdate", { newRoomData });
  }),
  o.validateNewRoomData()
);

export const submitNewRoom: Operator = pipe(
  o.validateNewRoomData(),
  o.shouldSubmitNewRoom(),
  o.submitNewRoom(),
  o.passToRoomSession(),
  o.handleNewRoomError()
);
