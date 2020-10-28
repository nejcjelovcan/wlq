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
import { requestMachine } from "./request.statemachine";
import { rootMachine } from "./root.statemachine";
import * as router from "./router";
import { tokenMachine } from "./token/token.statemachine";
import * as user from "./user";
import * as token from "./token";
import { userMachine } from "./user/user.statemachine";

export const config = merge(
  {
    state: rootMachine.create(
      { current: "Index" },
      {
        user: userMachine.create({
          current: "Partial",
          partialDetails: { type: "UserDetails" },
          errors: {}
        }),
        token: tokenMachine.create(
          {
            current: "Init"
          },
          { request: requestMachine.create({ current: "Init" }) }
        )
      }
    ),
    effects: { localStorage, rest }
  },
  namespaced({ user, router, token })
);

export const useOvermind = createHook<typeof config>();
export const useOvermindState = createStateHook<typeof config>();
export const useActions = createActionsHook<typeof config>();
export const useEffects = createEffectsHook<typeof config>();
export const useReaction = createReactionHook<typeof config>();

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
