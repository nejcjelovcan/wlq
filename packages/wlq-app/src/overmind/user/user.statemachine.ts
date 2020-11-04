import { IoErrors } from "@wlq/wlq-core";
import { UserDetails } from "@wlq/wlq-core/lib/model";
import { json, statemachine, Statemachine } from "overmind";

export type UserStates =
  | {
      current: "Partial";
      partialDetails: Partial<UserDetails>;
      errors: IoErrors;
    }
  | { current: "Valid"; validDetails: UserDetails };

export type UserEvents =
  | {
      type: "UserUpdate";
      data: { details: Partial<UserDetails> };
    }
  | { type: "UserValidate"; data: { details: UserDetails } }
  | { type: "UserErrors"; data: { errors: IoErrors } };

export function getUserDetails(
  state: UserStates | UserMachine
): Partial<UserDetails> {
  if (state.current === "Partial") return json(state.partialDetails);
  return json(state.validDetails);
}

export type UserMachine = Statemachine<UserStates, UserEvents>;

export const userMachine = statemachine<UserStates, UserEvents>({
  UserUpdate: (state, { details }) => {
    return {
      current: "Partial",
      partialDetails: { ...getUserDetails(state), ...details },
      errors: {}
    };
  },
  UserValidate: (_, { details }) => {
    return { current: "Valid", validDetails: details };
  },
  UserErrors: (state, { errors }) => {
    return {
      current: "Partial",
      partialDetails: getUserDetails(state),
      errors
    };
  }
});
