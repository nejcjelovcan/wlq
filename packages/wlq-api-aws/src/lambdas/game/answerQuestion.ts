import answerQuestion from "@wlq/wlq-core/lib/api/game/answerQuestion.websocket";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "aws-lambda";
import ApiGatewayManagementApi from "aws-sdk/clients/apigatewaymanagementapi";
import DynamoDB from "aws-sdk/clients/dynamodb";
import SNS from "aws-sdk/clients/sns";
import { newStateMachineEmitter } from "../../tools/stateMachineEmitter";
import {
  AwsOkResult,
  getWebsocketEventFromAws,
  newPublishEmitter,
  newRoomStore,
  newWebsocketEmitter
} from "../../tools";

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
  await answerQuestion(getWebsocketEventFromAws(event), store, emitter);
  return AwsOkResult;
}
