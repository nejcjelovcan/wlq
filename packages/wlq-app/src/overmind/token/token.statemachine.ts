import { Statemachine, statemachine } from "overmind";
import { RequestMachine } from "../request.statemachine";

export type TokenStates =
  | { current: "Init" }
  | { current: "Loaded"; token: string };

export type TokenEvents = { type: "LoadToken"; data: { token: string } };

export type TokenBaseState = { request: RequestMachine };

export type TokenMachine = Statemachine<
  TokenStates,
  TokenEvents,
  TokenBaseState
>;

export const tokenMachine = statemachine<
  TokenStates,
  TokenEvents,
  TokenBaseState
>({
  LoadToken: (_, { token }) => {
    return { current: "Loaded", token };
  }
});
