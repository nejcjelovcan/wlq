// import leaveRoom from "@wlq/wlq-api/src/room/leaveRoom";
import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  Context
} from "aws-lambda";
import { AwsOkResult } from "../tools";

export function handler(
  event: APIGatewayProxyEvent,
  _: Context,
  callback: APIGatewayProxyCallback
) {
  const { connectionId, routeKey } = event.requestContext;

  switch (routeKey) {
    case "$connect":
      console.log("CONNECT");
      break;
    case "$disconnect":
      console.log("DISCONNECT");

      // TODO removeParticipant
      if (connectionId) {
      }
      break;
    case "$default":
    // TODO call emitter.websocket with error (unrecognized action)
  }

  callback(undefined, AwsOkResult);
}
