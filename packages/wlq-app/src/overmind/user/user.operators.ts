import { IoErrors, sample } from "@wlq/wlq-core";
import {
  UserDetails,
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS
} from "@wlq/wlq-core/lib/model";
import { filter, map, mutate, Operator, pipe } from "overmind";
import { PageParams } from "../router/router.effects";
import { getUserDetails } from "./user.statemachine";

export const sendUserUpdate: () => Operator<Partial<UserDetails>> = () =>
  pipe(
    mutate(function sendUserUpdate({ state: { user } }, details) {
      user.send("UserUpdate", { details });
    }),
    // this is important! (otherwise we pass only update without previous values)
    map(function passUserDetails({ state: { user } }) {
      return getUserDetails(user);
    })
  );

export const sendUserValid: () => Operator<UserDetails> = () =>
  mutate(function sendUserValid({ state: { user } }, details) {
    user.send("UserValidate", { details });
  });

export const sendUserErrors: () => Operator<IoErrors> = () =>
  mutate(function sendUserErrors({ state: { user } }, errors) {
    user.send("UserErrors", { errors });
  });

export const generateRandomUserDetails: <T>() => Operator<
  T,
  Partial<UserDetails>
> = () =>
  map(function generateRandomUserDetails() {
    return {
      type: "UserDetails",
      color: sample(USER_DETAILS_COLORS),
      emoji: sample(USER_DETAILS_EMOJIS)
    };
  });

export const assureValidUserDetails: () => Operator<PageParams> = () =>
  filter(function assureValidUserDetails(
    {
      state: { user },
      actions: {
        router: { open }
      }
    },
    params
  ) {
    if (user.current !== "Valid") {
      open({
        path: "/settings",
        params: params.roomId ? { roomId: params.roomId } : undefined
      });
      return false;
    }
    return true;
  });
