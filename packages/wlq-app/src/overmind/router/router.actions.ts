import { Action, Operator } from "overmind";
import * as o from "./router.operators";
import { IParams } from "./router.effects";

export const goToIndex: Operator = o.setPage("Index");
export const goToNew: Operator = o.setPage("New");
export const goToRoom: Operator<IParams> = o.setPage("Room");
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
