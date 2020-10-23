import createRoom from "@wlq/wlq-core/lib/cjs/api/room/createRoom.rest";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { getEventFromAws } from "../../tools/event.helpers";
import { newRoomStore } from "../../tools/room.store";
import {
  newResponseEmitter,
  responseEmitterToAwsResult
} from "../../tools/response.emitter";

const DB = new DynamoDB.DocumentClient();

export default async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const emitter = newResponseEmitter();
  const store = newRoomStore(DB);
  await createRoom(getEventFromAws(event), store, emitter);
  return responseEmitterToAwsResult(emitter);
}
