import {
  catchError,
  filter,
  mutate,
  Operator,
  pipe,
  waitUntil
} from "overmind";

export const ifTokenNotLoaded: () => Operator = () =>
  filter(({ state: { token } }) => token.current !== "Loaded");

export const waitUntilTokenLoaded: () => Operator = () =>
  waitUntil(({ token }) => token.current === "Loaded");

export const requestToken: () => Operator = () =>
  pipe(
    mutate(async ({ state, effects: { rest } }) => {
      state.token.request.send("Request", { params: {} });
      const response = await rest.getToken();
      state.token.request.send("Response", { response });
      state.token.send("LoadToken", { token: response.token });
    }),
    // TODO only catch rest errors!
    catchError(({ state }, error) => {
      state.token.request.send("Error", { error: error.message });
    })
  );
