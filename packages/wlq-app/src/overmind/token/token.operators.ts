import { mutate, Operator, pipe, run, waitUntil } from "overmind";

export const waitUntilTokenLoaded: () => Operator = () =>
  waitUntil(function waitUntilTokenLoaded({ token }) {
    return token.current === "Loaded";
  });

export const setToken: () => Operator<string> = () =>
  pipe(
    mutate(function sendLoadToken({ state }, token) {
      state.token.send("LoadToken", { token });
    }),
    run(function setRestAuthorization({ effects: { rest } }, token) {
      rest.setAuthorization(token);
    })
  );

export const sendRequest: <T>() => Operator<T> = () =>
  mutate(function sendRequest({ state }) {
    state.token.request.send("Request");
  });

export const sendReceive: <T>() => Operator<T> = () =>
  mutate(function sendReceive({ state }) {
    state.token.request.send("Response");
  });

export const sendError: () => Operator<Error> = () =>
  mutate(function sendError({ state }, error) {
    state.token.request.send("Error", { error: error.message });
  });
