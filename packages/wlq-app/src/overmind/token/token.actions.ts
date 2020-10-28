import { mutate, Operator, pipe } from "overmind";
import { LocalStorageError } from "../effects/localStorage";
import {
  getFromLocalStorage,
  writeToLocalStorage,
  suppressError
} from "../operators";
import * as o from "./token.operators";

export const assureToken: Operator = pipe(
  getFromLocalStorage("token"),
  mutate(({ state }, token) => {
    state.token.send("LoadToken", { token });
  }),
  suppressError(LocalStorageError),
  o.ifTokenNotLoaded(),
  o.requestToken(),
  // TODO we should branch here, extractToken throwing is not a good idea
  // (abusing LocalStorageError to control flow as well...)
  o.extractToken(),
  writeToLocalStorage("token")
);
