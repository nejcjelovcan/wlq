import { resolveCodecEither } from "@wlq/wlq-core";
import { UserDetails, UserDetailsCodec } from "@wlq/wlq-core/lib/model";
import { Action, debounce, mutate, pipe } from "overmind";

export const setUserDetails: Action<Partial<UserDetails>, boolean> = (
  { state: { user }, effects: { localStorage } },
  userDetails
) => {
  const partialState = user.transition("Partial");
  if (partialState) {
    partialState.details = userDetails;
  }

  let validDetails: UserDetails | undefined = undefined;
  try {
    validDetails = resolveCodecEither(UserDetailsCodec.decode(userDetails));
  } catch (e) {}
  if (validDetails) {
    const validState = user.transition("Valid");
    if (validState) {
      validState.details = validDetails;
      localStorage.setItem("userDetails", JSON.stringify(validDetails));
      return true;
    }
  }

  return false;
};

export const throttledSetAlias: Action<string> = pipe(
  debounce(200),
  mutate(
    (
      {
        state: { user },
        actions: {
          user: { setUserDetails }
        }
      },
      alias
    ) => {
      const partialOrValidState =
        user.state === "Init" ? user.transition("Partial") : user;
      if (partialOrValidState) {
        setUserDetails({
          ...partialOrValidState.details,
          alias: alias ? alias : undefined
        });
      }
    }
  )
);
