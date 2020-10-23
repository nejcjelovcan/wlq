import { IStore } from "@wlq/wlq-core/lib";
import { RoomKey } from "@wlq/wlq-core/lib/model";
import DynamoDB from "aws-sdk/clients/dynamodb";

const TableName = process.env.ROOM_TABLE_NAME!;

const roomComposite = ({ roomId }: RoomKey) => ({ PK: roomId, SK: "#" });

export function newRoomStore(
  DB: DynamoDB.DocumentClient
): Pick<IStore, "addRoom"> {
  return {
    async addRoom(room) {
      await DB.put({
        TableName,
        Item: { ...room, ...roomComposite(room) },
        ConditionExpression: "attribute_not_exists(PK)"
      }).promise();
      return room;
    }
  };
}
