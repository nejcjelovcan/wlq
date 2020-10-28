import { RoomKeyCodec } from "@wlq/wlq-core/lib/model";
import { mutate, Operator, pipe, run } from "overmind";
import queryString from "query-string";
import { decode } from "../operators";
import { SettingsParamsCodec } from "../root.statemachine";
import { PageParams } from "./router.effects";
import * as o from "./router.operators";

export const setPageIndex: Operator = mutate(({ state }) => {
  state.send("SetIndex");
});

export const setPageNew: Operator = mutate(({ state }) => {
  state.send("SetNew");
});

export const setPageRoom: Operator<PageParams> = pipe(
  decode(RoomKeyCodec),
  mutate(({ state }, params) => {
    state.send("SetRoom", { params });
  }),
  o.redirectToIndexOnValidationError()
);

export const setPageSettings: Operator<PageParams> = pipe(
  decode(SettingsParamsCodec),
  mutate(({ state }, params) => {
    state.send("SetSettings", { params });
  })
  // All page settings params are optional so no need for redirect
  // o.redirectToIndexOnValidationError()
);

export const open: Operator<{ path: string; params?: PageParams }> = run(
  ({ effects: { router } }, { path, params }) => {
    const url = params ? `${path}?${queryString.stringify(params)}` : path;
    router.open(url);
  }
);
