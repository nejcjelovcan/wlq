import axiosLib, { AxiosRequestConfig } from "axios";
import * as AxiosLogger from "axios-logger";
import output from "./serverless-output.json";

import { resolveCodecEither } from "@wlq/wlq-core/lib";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/getToken.rest";

export const axios = axiosLib.create({
  baseURL: output.ServiceEndpoint
});
axios.interceptors.request.use(AxiosLogger.requestLogger);

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
