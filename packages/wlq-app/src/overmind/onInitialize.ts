import { OnInitialize } from "overmind";
import { sample } from "@wlq/wlq-core";
import {
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS
} from "@wlq/wlq-core/lib/model";

export const onInitialize: OnInitialize = ({
  actions: {
    token: { setToken, requestToken },
    user: { setUserDetails }
  },
  effects: { localStorage }
}) => {
  const token = localStorage.getItem("token");
  if (token) setToken(token);
  else requestToken();

  let detailsValid = false;
  const userDetails = localStorage.getItem("userDetails");
  if (userDetails) {
    try {
      detailsValid = setUserDetails(JSON.parse(userDetails));
    } catch (e) {}
  }
  if (!detailsValid) {
    setUserDetails({
      type: "UserDetails",
      color: sample(USER_DETAILS_COLORS),
      emoji: sample(USER_DETAILS_EMOJIS)
    });
  }
};
