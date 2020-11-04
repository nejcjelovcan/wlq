// import leaveRoom from "@wlq/wlq-api/src/room/leaveRoom";
import leaveRoom from "@wlq/wlq-core/lib/api/room/leaveRoom.websocket";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import SNS from "aws-sdk/clients/sns";
import { AwsOkResult, newPublishEmitter, newRoomStore } from "../tools";

const DB = new DynamoDB.DocumentClient();
const Notification = new SNS();

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  const { connectionId, routeKey } = event.requestContext;

  switch (routeKey) {
    case "$connect":
      console.log("CONNECT");
      break;
    case "$disconnect":
      console.log("DISCONNECT");

      if (connectionId) {
        const emitter = {
          ...newPublishEmitter(Notification, context)
        };
        const store = newRoomStore(DB);
        await leaveRoom({ connectionId, payload: {} }, store, emitter);
      }
      break;
    case "$default":
    // TODO call emitter.websocket with error (unrecognized action)
  }

  return AwsOkResult;
}
