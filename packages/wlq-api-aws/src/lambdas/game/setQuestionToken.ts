import setQuestionToken from "@wlq/wlq-core/lib/api/game/setQuestionToken";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { newRoomStore } from "../../tools";

const DB = new DynamoDB.DocumentClient();

export const handler = async (event: { [key: string]: unknown }) => {
  const store = newRoomStore(DB);
  await setQuestionToken(event, store);
};
