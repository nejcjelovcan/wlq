import { UserDetails } from "@wlq/wlq-core/lib/model";
import { statemachine } from "overmind";

export type UserState =
  | {
      state: "Init";
    }
  | { state: "Partial"; details: Partial<UserDetails> }
  | { state: "Valid"; details: UserDetails };

export const state = statemachine<UserState>(
  {
    Init: ["Partial"],
    Partial: ["Valid"],
    Valid: ["Partial"]
  },
  {
    state: "Init"
  }
);
