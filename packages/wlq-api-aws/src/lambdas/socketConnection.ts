// import leaveRoom from "@wlq/wlq-api/src/room/leaveRoom";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { AwsOkResult } from "../tools";

export function handler(event: APIGatewayProxyEvent): APIGatewayProxyResult {
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

  return AwsOkResult;
}
