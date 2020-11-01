import startGame from "@wlq/wlq-core/lib/api/game/startGame.websocket";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import ApiGatewayManagementApi from "aws-sdk/clients/apigatewaymanagementapi";
import DynamoDB from "aws-sdk/clients/dynamodb";
import SNS from "aws-sdk/clients/sns";
import {
  AwsOkResult,
  getWebsocketEventFromAws,
  newPublishEmitter,
  newRoomStore,
  newWebsocketEmitter
} from "../../tools";
import { newStateMachineEmitter } from "../../tools/stateMachineEmitter";

const DB = new DynamoDB.DocumentClient();
const WebsocketGateway = new ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.WEBSOCKET_ENDPOINT!
});
const Notification = new SNS();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const emitter = {
    ...newWebsocketEmitter(WebsocketGateway),
    ...newPublishEmitter(Notification, context),
    ...newStateMachineEmitter()
  };
  const store = newRoomStore(DB);
  await startGame(getWebsocketEventFromAws(event), store, emitter);
  return AwsOkResult;
}
