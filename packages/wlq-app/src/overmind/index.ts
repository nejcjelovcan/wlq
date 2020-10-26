import { IConfig } from "overmind";
import { merge, namespaced } from "overmind/config";
import {
  createHook,
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook
} from "overmind-react";

// import * as api from "../utils/api";
import * as localStorage from "./effects/localStorage";
// import websocket from "./effects/websocket";
import rest from "./effects/rest";

import * as token from "./token";
// import * as user from "./user";
// // import * as room from "./room";
// import * as newRoom from "./newRoom";
// import * as roomSession from "./roomSession";

// import { onInitialize } from "./onInitialize";
// import { state } from "./root.state";

import * as router from "./router";
import { tokenMachine } from "./token/token.statemachine";

export const config = merge(
  {
    state: { token: tokenMachine.create({ current: "Init" }) },
    effects: { rest, localStorage }
  },
  namespaced({ router, token })
);

export const useOvermind = createHook<typeof config>();
export const useOvermindState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
