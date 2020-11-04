import { UserDetails, UserDetailsCodec } from "@wlq/wlq-core/lib/model";
import { debounce, Operator, pipe } from "overmind";
import {
  decode,
  fold,
  getJsonFromLocalStorage,
  writeJsonToLocalStorage
} from "../operators";
import * as o from "./user.operators";

export const updateDetails: Operator<Partial<UserDetails>> = pipe(
  debounce(200),
  o.sendUserUpdate(),
  decode(UserDetailsCodec),
  fold({
    success: pipe(o.sendUserValid(), writeJsonToLocalStorage("userDetails")),
    error: o.sendUserErrors()
  })
);

export const loadOrRandomizeDetails = pipe(
  getJsonFromLocalStorage("userDetails"),
  fold({
    success: pipe(
      o.sendUserUpdate(),
      decode(UserDetailsCodec),
      fold({
        success: o.sendUserValid(),
        error: _generate()
      })
    ),
    error: _generate()
  })
);

function _generate<T>(): Operator<T> {
  return pipe(
    o.generateRandomUserDetails(),
    o.sendUserUpdate(),
    decode(UserDetailsCodec),
    fold({
      success: o.sendUserValid(),
      error: o.sendUserErrors()
    })
  );
}
