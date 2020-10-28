import { statemachine, Statemachine } from "overmind";

export type RequestStates =
  | { current: "Init" }
  | { current: "Requested"; params: { [key: string]: unknown } }
  | { current: "Done"; response: { [key: string]: unknown } }
  | { current: "Error"; error: string };

export type RequestEvents =
  | {
      type: "Request";
      data: { params: { [key: string]: unknown } };
    }
  | { type: "Response"; data: { response: { [key: string]: unknown } } }
  | { type: "Error"; data: { error: string } };

export type RequestMachine = Statemachine<RequestStates, RequestEvents>;

export const requestMachine = statemachine<RequestStates, RequestEvents>({
  Request: (_, { params }) => {
    return { current: "Requested", params };
  },
  Response: (_, { response }) => {
    return { current: "Done", response };
  },
  Error: (_, { error }) => {
    return { current: "Error", error };
  }
});
