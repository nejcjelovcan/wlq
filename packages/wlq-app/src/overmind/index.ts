import { IConfig } from 'overmind'
import { merge, namespaced } from 'overmind/config'
import {
  createHook,
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from 'overmind-react'

import * as api from '../utils/api'
import * as localStorage from '../utils/localStorage'
import * as user from './user'
// import * as room from './room'

export const config = merge(
  { state: {}, effects: { api, localStorage } },
  namespaced({ user }),
)

export const useOvermind = createHook<typeof config>()
export const useState = createStateHook<typeof config>()
export const useActions = createActionsHook<typeof config>()
export const useEffects = createEffectsHook<typeof config>()
export const useReaction = createReactionHook<typeof config>()

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}