import { Action, Operator, pipe } from "overmind";
import { IParams } from "./router.effects";
import * as o from "./router.operators";

export const goToIndex: Operator = o.setPage("Index");
export const goToNew: Operator = o.setPage("New");
export const goToRoom: Operator<IParams> = pipe(o.setPage("Room"));
export const goToSettings: Operator<IParams> = o.setPage("Settings");

export const open: Action<string> = (
  {
    effects: {
      router: { open }
    }
  },
  path
) => {
  open(path);
};
