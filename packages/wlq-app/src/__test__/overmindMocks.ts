import { Config } from "overmind";
import { NestedPartial } from "overmind/lib/internalTypes";
import deepExtend from "deep-extend";

export type EffectMocks = NestedPartial<Config["effects"]>;

const defaultEffectMocks: EffectMocks = {
  localStorage: {
    getItem: key => {
      if (key === "token") return "tokenValue";
      throw new Error("Unexpected localStorage.getItem call");
    },
    setItem: () => {}
  },
  rest: { setAuthorization: () => {} },
  websocket: {
    initialize: () => {},
    setOnMessage: () => {},
    setOnOpen: () => {}
  },
  router: { open: () => {} }
};

export const withEffectMocks = (...effects: EffectMocks[]): EffectMocks =>
  deepExtend({}, defaultEffectMocks, ...effects);

// const tokenEffectMocks: EffectMocks = {
//   localStorage: {
//     getItem: key => {
//       if (key === "token") return "tokenValue";
//       throw new Error("Unexpected localStorage.getItem call");
//     }
//   },
//   rest: {
//     setAuthorization: () => {}
//   }
// };

// export const withTokenEffectMocks = (effects: EffectMocks): EffectMocks =>
//   deepExtend({}, tokenEffectMocks, effects);

// const websocketMocks: EffectMocks = { websocket: { initialize: () => {} } };

// export const withWebsocketEffectMocks = (effects: EffectMocks): EffectMocks =>
//   deepExtend({}, withTokenEffectMocks(websocketMocks), effects);
