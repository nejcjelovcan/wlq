import { RoomKey, RoomPublic } from "@wlq/wlq-core/lib/model";
import { statemachine, Statemachine } from "overmind";
import { UserMachine } from "./user/user.statemachine";
import * as t from "io-ts";
import { TokenMachine } from "./token/token.statemachine";
import {
  roomSessionMachine,
  RoomSessionMachine
} from "./roomSession/roomSession.statemachine";
import { requestMachine } from "./request.statemachine";
import { roomMachine } from "./roomSession/room/room.statemachine";
import { newRoomMachine, NewRoomMachine } from "./newRoom/newRoom.statemachine";

export const SettingsParamsCodec = t.partial({ roomId: t.string });
export type SettingsParams = t.TypeOf<typeof SettingsParamsCodec>;

export type RootStates =
  | {
      current: "Index";
    }
  | { current: "New"; newRoom: NewRoomMachine }
  | {
      current: "Room";
      params: RoomKey;
      roomSession: RoomSessionMachine;
    }
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
  | { type: "SetRoomFromCreate"; data: { room: RoomPublic } }
  | { type: "SetSettings"; data: { params: SettingsParams } };

export type RootMachine = Statemachine<RootStates, RootEvents, RootBaseState>;

export const rootMachine = statemachine<RootStates, RootEvents, RootBaseState>({
  SetIndex: () => {
    return { current: "Index" };
  },
  SetNew: () => {
    return {
      current: "New",
      newRoom: newRoomMachine.create(
        {
          current: "Valid",
          validNewRoom: { listed: true }
        },
        { request: requestMachine.create({ current: "Init" }) }
      )
    };
  },
  SetRoom: (state, { params }) => {
    if (state.current === "Room" && state.params.roomId === params.roomId)
      return;
    return {
      current: "Room",
      params,
      roomSession: roomSessionMachine.create(
        { current: "Init" },
        {
          participants: [],
          request: requestMachine.create({ current: "Init" }),
          room: roomMachine.create({ current: "Empty" })
        }
      )
    };
  },
  SetRoomFromCreate: (_, { room }) => {
    return {
      current: "Room",
      params: { roomId: room.roomId },
      roomSession: roomSessionMachine.create(
        { current: "Init" },
        {
          participants: [],
          request: requestMachine.create({ current: "Done" }),
          room: roomMachine.create(room)
        }
      )
    };
  },
  SetSettings: (_, { params }) => {
    return { current: "Settings", params };
  }
});
