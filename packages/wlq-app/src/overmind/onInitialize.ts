import { OnInitialize } from "overmind";

export const onInitialize: OnInitialize = ({
  actions: {
    token: { setToken, requestToken }
  },
  effects: { localStorage }
}) => {
  const token = localStorage.getItem("token");
  if (token) setToken(token);
  else requestToken();
};
