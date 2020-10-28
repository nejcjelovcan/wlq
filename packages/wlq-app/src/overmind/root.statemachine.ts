import { RoomKey } from "@wlq/wlq-core/lib/model";
import { statemachine, Statemachine } from "overmind";
import { UserMachine } from "./user/user.statemachine";
import * as t from "io-ts";
import { TokenMachine } from "./token/token.statemachine";

export const SettingsParamsCodec = t.partial({ next: t.string });
export type SettingsParams = t.TypeOf<typeof SettingsParamsCodec>;

export type RootStates =
  | {
      current: "Index";
    }
  | { current: "New" }
  | { current: "Room"; params: RoomKey }
  | { current: "Settings"; params: SettingsParams };

export type RootBaseState = {
  token: TokenMachine;
  user: UserMachine;
};

export type RootEvents =
  | {
      type: "SetIndex";
      data: void;
    }
  | { type: "SetNew"; data: void }
  | { type: "SetRoom"; data: { params: RoomKey } }
  | { type: "SetSettings"; data: { params: SettingsParams } };

export type RootMachine = Statemachine<RootStates, RootEvents, RootBaseState>;

export const rootMachine = statemachine<RootStates, RootEvents, RootBaseState>({
  SetIndex: () => {
    return { current: "Index" };
  },
  SetNew: () => {
    return { current: "New" };
  },
  SetRoom: (_, { params }) => {
    return { current: "Room", params };
  },
  SetSettings: (_, { params }) => {
    return { current: "Settings", params };
  }
});
