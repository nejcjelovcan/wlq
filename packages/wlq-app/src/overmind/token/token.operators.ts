import { Operator, mutate, filter, catchError, action } from "overmind";

export const loadToken: <T>() => Operator<T> = () =>
  mutate(function loadToken({ state, effects: { localStorage } }) {
    const token = localStorage.getItem("token");
    if (token) {
      state.token.send("TokenLoad", { token });
    }
  });

export const shouldRequestToken: <T>() => Operator<T> = () =>
  filter(function shouldRequestToken({ state }) {
    return state.token.current !== "Loaded";
  });

export const requestToken: <T>() => Operator<T> = () =>
  mutate(async function requestToken({ state, effects: { rest } }) {
    state.token.send("TokenRequest");
    const { token } = await rest.getToken();
    state.token.send("TokenReceive", { token });
  });

export const handleTokenError: () => Operator = () =>
  catchError(function handleTokenError({ state }, error) {
    state.token.send("TokenError", { error: error.message });
  });

export const writeToken: () => Operator = () =>
  action(function writeToken({ state: { token }, effects: { localStorage } }) {
    if (token.current === "Loaded") {
      localStorage.setItem("token", token.token);
    }
  });
