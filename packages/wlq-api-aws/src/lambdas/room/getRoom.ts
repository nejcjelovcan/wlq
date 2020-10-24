import getRoom from "@wlq/wlq-core/lib/api/room/getRoom.rest";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import {
  getEventFromAws,
  newResponseEmitter,
  newRoomStore,
  responseEmitterToAwsResult
} from "../../tools";

const DB = new DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const emitter = newResponseEmitter();
  const store = newRoomStore(DB);
  await getRoom(getEventFromAws(event), store, emitter);
  return responseEmitterToAwsResult(emitter);
}
