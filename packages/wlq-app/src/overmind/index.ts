import { IConfig } from "overmind";
import {
  createActionsHook,
  createEffectsHook,
  createHook,
  createReactionHook,
  createStateHook
} from "overmind-react";
import { merge, namespaced } from "overmind/config";
import * as localStorage from "./effects/localStorage";
import rest from "./effects/rest";
import websocket from "./effects/websocket";
import * as newRoom from "./newRoom";
import { newRoomMachine } from "./newRoom/newRoom.statemachine";
import * as roomSession from "./roomSession";
import { roomSessionMachine } from "./roomSession/roomSession.statemachine";
import * as router from "./router";
import * as token from "./token";
import { tokenMachine } from "./token/token.statemachine";
import * as user from "./user";
import { userMachine } from "./user/user.statemachine";

export const config = merge(
  {
    state: {
      token: tokenMachine.create({ current: "Init" }),
      user: userMachine.create({
        current: "Partial",
        details: { type: "UserDetails" }
      }),
      newRoom: newRoomMachine.create(
        {
          current: "Editing",
          valid: true
        },
        { newRoomData: { listed: true } }
      ),
      roomSession: roomSessionMachine.create({ current: "Init" })
    },
    effects: { rest, localStorage, websocket }
  },
  namespaced({ router, token, user, newRoom, roomSession })
);

export const useOvermind = createHook<typeof config>();
export const useOvermindState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
