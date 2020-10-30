import axiosLib, { AxiosInstance, AxiosRequestConfig } from "axios";
import WebSocket from "ws";
// import * as AxiosLogger from "axios-logger";
import output from "./serverless-output.json";

import {
  decodeThrow,
  IWebsocketMessage,
  decodeWebsocketMessage
} from "@wlq/wlq-core";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/GetTokenResponse";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: output.ServiceEndpoint
};
export const axios = axiosLib.create(axiosConfig);
// axios.interceptors.request.use(AxiosLogger.requestLogger);

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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export type WebsocketClient = {
  send: (message: IWebsocketMessage) => Promise<IWebsocketMessage[]>;
  close: () => void;
};

// eslint-disable-next-line require-await
export async function websocketClient(
  count = 1,
  options: { log?: boolean } = {}
): Promise<WebsocketClient> {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(output.ServiceEndpointWebsocket);
    let resolved = false;
    let queue: IWebsocketMessage[] = [];

    client.onerror = reject;

    client.onopen = function() {
      resolve({
        send: async (
          message: IWebsocketMessage
          // eslint-disable-next-line require-await
        ) => {
          return new Promise((resolve, reject) => {
            client.onmessage = message => {
              if (options.log) console.log("onMessage", message.data);
              try {
                const decoded = decodeWebsocketMessage(
                  JSON.parse(message.data.toString())
                );
                queue.push(decoded);
                // resolve when queue length reaches count
                if (!resolved && queue.length >= count) {
                  resolved = true;
                  resolve(queue);
                }
              } catch (e) {
                reject(e);
              }
            };
            client.onerror = reject;
            client.send(JSON.stringify(message));
          });
        },
        close: () => client.close()
      });
    };
  });
}
