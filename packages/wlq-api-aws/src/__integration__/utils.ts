import { decodeThrow } from "@wlq/wlq-core";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/GetTokenResponse";
import axiosLib, { AxiosInstance, AxiosRequestConfig } from "axios";
import output from "./serverless-output.json";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: output.ServiceEndpoint
};
export const axios = axiosLib.create(axiosConfig);

// TODO we could just generate token on the client side
// (as long as the API_OCT_SECRET_KEY in .env is the same as deployed on server)
export async function getToken(): Promise<string> {
  const response = await axios.get("getToken");
  const { token } = decodeThrow(GetTokenResponseCodec, response.data);
  return token;
}

export type Session = {
  axios: AxiosInstance;
  token: string;
};
export async function createSession(): Promise<Session> {
  const token = await getToken();
  return {
    axios: axiosLib.create({
      ...axiosConfig,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
    token
  };
}

export function wait(time: number = 2000) {
  return async () => await new Promise(resolve => setTimeout(resolve, time));
}

export { default as websocketClient } from "./websocketClient";
