import revealAnswer from "@wlq/wlq-core/lib/api/game/revealAnswer";
import { Context } from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";
import SNS from "aws-sdk/clients/sns";
import { newStateMachineEmitter } from "tools/stateMachine.emitter";
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
  await revealAnswer(event, store, emitter);
};
