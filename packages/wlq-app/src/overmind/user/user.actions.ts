import { UserDetails, UserDetailsCodec } from "@wlq/wlq-core/lib/model";
import { debounce, Operator, pipe } from "overmind";
import { LocalStorageError } from "../effects/localStorage";
import { decode, getJsonFromLocalStorage, suppressError } from "../operators";
import * as o from "./user.operators";

const _update: Operator<Partial<UserDetails>> = pipe(
  o.sendUserUpdate(),
  decode(UserDetailsCodec),
  o.sendUserValid(),
  o.handleValidationError()
);

export const updateDetails: Operator<Partial<UserDetails>> = pipe(
  debounce(200),
  _update
);

export const loadOrRandomizeDetails: Operator = pipe(
  getJsonFromLocalStorage("userDetails"),
  _update,
  suppressError(LocalStorageError),
  o.ifUserDetailsInvalid(),
  o.generateRandomUserDetails(),
  _update
);
