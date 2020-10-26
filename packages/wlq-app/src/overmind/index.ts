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
// import * as localStorage from "./effects/localStorage";
// import websocket from "./effects/websocket";
// import rest from "./effects/rest";

// import * as token from "./token";
// import * as user from "./user";
// // import * as room from "./room";
// import * as newRoom from "./newRoom";
// import * as roomSession from "./roomSession";

// import { onInitialize } from "./onInitialize";

import * as router from "./router";

export const config = merge({ state: {}, effects: {} }, namespaced({ router }));

export const useOvermind = createHook<typeof config>();
export const useOvermindState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
