import { statemachine, Statemachine } from "overmind";

export type RequestStates =
  | { current: "Init" }
  | { current: "Requested" }
  | { current: "Done" }
  | { current: "Error"; error: string };

export type RequestEvents =
  | { type: "Request" }
  | { type: "Response" }
  | { type: "Error"; data: { error: string } };

export type RequestMachine = Statemachine<RequestStates, RequestEvents>;

export const requestMachine = statemachine<RequestStates, RequestEvents>({
  Request: _ => {
    return { current: "Requested" };
  },
  Response: _ => {
    return { current: "Done" };
  },
  Error: (_, { error }) => {
    return { current: "Error", error };
  }
});
