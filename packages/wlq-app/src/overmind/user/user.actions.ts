import { UserDetails } from "@wlq/wlq-core/lib/model";
import { debounce, mutate, Operator, pipe } from "overmind";
import * as o from "./user.operators";

export const loadOrRandomizeDetails: Operator = pipe(
  o.loadUserDetails(),
  o.validateUserDetails(),
  o.randomizeUserDetailsOnError()
);

export const updateDetails: Operator<Partial<UserDetails>> = pipe(
  debounce(200),
  mutate(({ state: { user } }, details) => {
    user.send("UserUpdate", { details });
  }),
  o.validateUserDetails(),
  o.checkUserDetailsValid(),
  o.writeUserDetails()
);
