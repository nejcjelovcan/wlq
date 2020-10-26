import { decodeThrow, sample } from "@wlq/wlq-core";
import {
  UserDetailsCodec,
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS
} from "@wlq/wlq-core/lib/model";
import { action, catchError, filter, json, mutate, Operator } from "overmind";

export const loadUserDetails: <T>() => Operator<T> = () =>
  mutate(function loadUserDetails({ state, effects: { localStorage } }) {
    const details = localStorage.getItem("userDetails");
    if (details) {
      const parsed = JSON.parse(details);
      state.user.send("UserUpdate", {
        details: parsed
      });
    }
  });

export const checkUserDetailsValid: <T>() => Operator<T> = () =>
  filter(({ state: { user } }) => user.current === "Valid");

export const writeUserDetails: <T>() => Operator<T> = () =>
  action(function writeUserDetails({
    state: { user },
    effects: { localStorage }
  }) {
    if (user.current === "Valid") {
      localStorage.setItem("userDetails", JSON.stringify(user.details));
    }
  });

export const validateUserDetails: <T>() => Operator<T> = () =>
  mutate(function validateUserDetails({ state: { user } }) {
    const details = decodeThrow(UserDetailsCodec, json(user.details));
    user.send("UserSetValid", { details });
  });

export const randomizeUserDetailsOnError: () => Operator = () =>
  catchError(({ state: { user } }) => {
    user.send("UserUpdate", {
      details: {
        type: "UserDetails",
        color: sample(USER_DETAILS_COLORS),
        emoji: sample(USER_DETAILS_EMOJIS)
      }
    });
  });
