import { NewRoom, NewRoomCodec } from "@wlq/wlq-core/lib/model";
import * as e from "fp-ts/Either";
import { map, noop, Operator, pipe } from "overmind";
import { decode, fold, waitUntilTokenLoaded } from "../operators";
import { openRoomFromCreate } from "../roomSession/roomSession.operators";
import * as o from "./newRoom.operators";

export const updateNewRoom: Operator<Partial<NewRoom>> = pipe(
  o.sendNewRoomUpdate(),
  decode(NewRoomCodec),
  fold({
    success: o.sendNewRoomValid(),
    error: noop()
  })
);

export const submitNewRoom: Operator = pipe(
  waitUntilTokenLoaded(),
  o.sendRequest(),
  map(async function requestCreateRoom({ state, effects: { rest } }) {
    try {
      if (state.current === "New" && state.newRoom.current === "Valid") {
        return e.right(await rest.createRoom(state.newRoom.validNewRoom));
      } else {
        return e.left(new Error("Unexpected state"));
      }
    } catch (error) {
      return e.left(error);
    }
  }),
  fold({
    success: pipe(o.sendReceive(), openRoomFromCreate()),
    error: o.sendError()
  })
);
