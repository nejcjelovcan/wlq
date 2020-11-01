import nextQuestion from "@wlq/wlq-core/lib/api/game/nextQuestion";
import { Context } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import SNS from "aws-sdk/clients/sns";
import { newStateMachineEmitter } from "../../tools/stateMachineEmitter";
import { newPublishEmitter, newRoomStore } from "../../tools";

const DB = new DynamoDB.DocumentClient();
const Notification = new SNS();

export const handler = async (
  event: { [key: string]: unknown },
  context: Context
) => {
  const store = newRoomStore(DB);
  const emitter = {
    ...newPublishEmitter(Notification, context),
    ...newStateMachineEmitter()
  };
  await nextQuestion(event, store, emitter);
};
