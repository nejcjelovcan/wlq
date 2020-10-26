import { statemachine, Statemachine } from "overmind";

export type TokenStates =
  | { current: "Init" }
  | { current: "Loaded"; token: string }
  | { current: "Requesting" }
  | { current: "Error"; error: string };

export type TokenEvents =
  | { type: "TokenLoad"; data: { token: string } }
  | { type: "TokenRequest" }
  | { type: "TokenReceive"; data: { token: string } }
  | { type: "TokenError"; data: { error: string } };

export type TokenMachine = Statemachine<TokenStates, TokenEvents>;
export const tokenMachine = statemachine<TokenStates, TokenEvents>({
  TokenLoad: (state, { token }) => {
    if (state.current === "Init") {
      return { current: "Loaded", token };
    }
    return;
  },
  TokenRequest: state => {
    if (state.current === "Init") {
      return { current: "Requesting" };
    }
    return;
  },
  TokenReceive: (state, { token }) => {
    if (state.current === "Requesting") {
      return { current: "Loaded", token };
    }
    return;
  },
  TokenError: (_, { error }) => {
    return { current: "Error", error };
  }
});
