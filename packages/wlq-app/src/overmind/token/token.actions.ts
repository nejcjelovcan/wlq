import { Action, AsyncAction } from "overmind";

export const setToken: Action<string> = (
  { state: { token }, effects: { rest } },
  tokenString
) => {
  const tokenState = token.transition("Token");
  if (tokenState) {
    tokenState.token = tokenString;
    rest.setAuthorization(tokenString);
  }
};

export const setError: Action<string> = ({ state: { token } }, error) => {
  const tokenState = token.transition("Error");
  if (tokenState) {
    tokenState.error = error;
  }
};

export const requestToken: AsyncAction = async ({
  actions: {
    token: { setToken, setError }
  },
  effects: { rest, localStorage }
}) => {
  try {
    const { token } = await rest.getToken();
    setToken(token);
    localStorage.setItem("token", token);
  } catch (e) {
    setError(e.message);
  }
};
