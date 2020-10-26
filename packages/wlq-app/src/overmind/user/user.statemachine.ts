import { UserDetails } from "@wlq/wlq-core/lib/model";
import { statemachine, Statemachine } from "overmind";

export type UserStates = { details: Partial<UserDetails> } & (
  | { current: "Partial" }
  | { current: "Valid"; details: UserDetails }
);

export type UserEvents =
  | {
      type: "UserUpdate";
      data: { details: Partial<UserDetails> };
    }
  | { type: "UserSetValid"; data: { details: UserDetails } };

export type UserMachine = Statemachine<UserStates, UserEvents>;
export const userMachine = statemachine<UserStates, UserEvents>({
  UserUpdate: (state, { details }) => {
    return { current: "Partial", details: { ...state.details, ...details } };
  },
  UserSetValid: (_, { details }) => {
    return { current: "Valid", details };
  }
});
