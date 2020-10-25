import { statemachine } from "overmind";

export type TokenState =
  | { state: "Init" }
  | { state: "Requested" }
  | { state: "Token"; token: string }
  | { state: "Error"; error: string };

export const state = statemachine<TokenState>(
  {
    Init: ["Requested", "Token", "Error"],
    Requested: ["Token", "Error"],
    Token: ["Init", "Error"],
    Error: ["Init"]
  },
  { state: "Init" }
);
