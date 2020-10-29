import { RoomKeyCodec } from "@wlq/wlq-core/lib/model";
import { mutate, Operator, pipe, run } from "overmind";
import queryString from "query-string";
import { decode, fold } from "../operators";
import { SettingsParamsCodec } from "../root.statemachine";
import { PageParams } from "./router.effects";
import * as o from "./router.operators";

export const setPageIndex: Operator = mutate(function setPageIndex({ state }) {
  state.send("SetIndex");
});

export const setPageNew: Operator = mutate(function setPageNew({ state }) {
  state.send("SetNew");
});

export const setPageRoom: Operator<PageParams> = pipe(
  decode(RoomKeyCodec),
  fold({
    success: mutate(function setPageRoom({ state }, params) {
      state.send("SetRoom", { params });
    }),
    error: o.redirectToIndex()
  })
);

export const setPageSettings: Operator<PageParams> = pipe(
  decode(SettingsParamsCodec),
  fold({
    success: mutate(function setPageSettings({ state }, params) {
      state.send("SetSettings", { params });
    }),
    error: o.redirectToIndex()
  })
);

export const open: Operator<{ path: string; params?: PageParams }> = run(
  function open({ effects: { router } }, { path, params }) {
    const url = params ? `${path}?${queryString.stringify(params)}` : path;
    router.open(url);
  }
);
