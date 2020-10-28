import { UserDetails, UserDetailsCodec } from "@wlq/wlq-core/lib/model";
import { debounce, Operator, pipe } from "overmind";
import { LocalStorageError } from "../effects/localStorage";
import {
  decode,
  getJsonFromLocalStorage,
  suppressError,
  writeJsonToLocalStorage
} from "../operators";
import * as o from "./user.operators";

const _update: Operator<Partial<UserDetails>> = pipe(
  o.sendUserUpdate(),
  decode(UserDetailsCodec),
  o.sendUserValid()
);

export const updateDetails: Operator<Partial<UserDetails>> = pipe(
  debounce(200),
  _update,
  writeJsonToLocalStorage("userDetails"),
  o.handleValidationError()
);

export const loadOrRandomizeDetails: Operator = pipe(
  getJsonFromLocalStorage("userDetails"),
  _update,
  o.handleValidationError(),
  suppressError(LocalStorageError),
  o.ifUserDetailsInvalid(),
  o.generateRandomUserDetails(),
  _update,
  o.handleValidationError()
);
