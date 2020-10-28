import { IoValidationError, sample } from "@wlq/wlq-core";
import {
  UserDetails,
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS
} from "@wlq/wlq-core/lib/model";
import { catchError, filter, map, mutate, Operator, pipe } from "overmind";
import { getUserDetails } from "./user.statemachine";

export const sendUserUpdate: () => Operator<Partial<UserDetails>> = () =>
  pipe(
    mutate(({ state: { user } }, details) => {
      user.send("UserUpdate", { details });
    }),
    map(({ state: { user } }) => {
      return getUserDetails(user);
    })
  );

export const sendUserValid: () => Operator<UserDetails> = () =>
  mutate(({ state: { user } }, details) => {
    user.send("UserValidate", { details });
  });

export const handleValidationError: () => Operator = () =>
  catchError(({ state: { user } }, error) => {
    if (error instanceof IoValidationError) {
      user.send("UserErrors", { errors: error.errors });
    } else {
      throw error;
    }
  });

export const ifUserDetailsInvalid: () => Operator = () =>
  filter(({ state: { user } }) => {
    return user.current !== "Valid";
  });

export const generateRandomUserDetails: () => Operator<
  void,
  Partial<UserDetails>
> = () =>
  map(() => {
    return {
      type: "UserDetails",
      color: sample(USER_DETAILS_COLORS),
      emoji: sample(USER_DETAILS_EMOJIS)
    };
  });
