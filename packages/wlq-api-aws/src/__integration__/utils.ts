import axiosLib, { AxiosRequestConfig } from "axios";
import WebSocket from "ws";
// import * as AxiosLogger from "axios-logger";
import output from "./serverless-output.json";

import { resolveCodecEither } from "@wlq/wlq-core";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/getToken.rest";

export const axios = axiosLib.create({
  baseURL: output.ServiceEndpoint
});
// axios.interceptors.request.use(AxiosLogger.requestLogger);

export async function getToken(): Promise<string> {
  const response = await axios.get("getToken");
  const { token } = resolveCodecEither(
    GetTokenResponseCodec.decode(response.data)
  );
  return token;
}

export async function getTokenConfig(): Promise<AxiosRequestConfig> {
  const token = await getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export function newWebsocketClient(
  onOpen: () => void,
  onMessage: (e: any) => void
) {
  const client = new WebSocket(output.ServiceEndpointWebsocket, {
    protocol: "8"
  });

  client.onerror = function(e) {
    console.log("Connection Error", e);
  };

  client.onopen = function() {
    console.log("WebSocket Client Connected");
    onOpen();
  };

  client.onclose = function() {
    console.log("echo-protocol Client Closed");
  };

  client.onmessage = onMessage;

  return client;
}
