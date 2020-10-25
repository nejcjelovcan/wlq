import { IEmitter, IRestResponse } from "@wlq/wlq-core";
import { APIGatewayProxyResult } from "aws-lambda";

export type ResponseEmitter = Pick<IEmitter, "restResponse" | "response">;

export function newResponseEmitter(): ResponseEmitter {
  let _response: IRestResponse | undefined = undefined;

  return {
    restResponse(response) {
      if (_response) {
        console.error("Unexpected second response");

        throw new Error("Unexpected second response");
      }
      _response = response;
    },
    get response() {
      return _response;
    }
  };
}

export const COMMON_HEADERS = {
  "Access-Control-Allow-Origin": process.env.HTTP_ORIGIN!,
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Credentials": "true"
};

const formatBody = (data: { [key: string]: any }) =>
  JSON.stringify(data, null, "  ");

export function responseToAwsResult({
  statusCode,
  payload
}: IRestResponse): APIGatewayProxyResult {
  return {
    statusCode,
    headers: COMMON_HEADERS,
    body: formatBody(payload)
  };
}

export const AwsErrorResult: APIGatewayProxyResult = {
  statusCode: 500,
  headers: COMMON_HEADERS,
  body: formatBody({ error: "Internal server error" })
};

// used for e.g. websocket apis that don't have an actual response
export const AwsOkResult: APIGatewayProxyResult = {
  statusCode: 200,
  headers: COMMON_HEADERS,
  body: "{}"
};

export function responseEmitterToAwsResult(responseEmitter: ResponseEmitter) {
  if (responseEmitter.response) {
    return responseToAwsResult(responseEmitter.response);
  }
  return AwsErrorResult;
}
