import {
  IStore,
  NotFoundStoreError,
  resolveCodecEither
} from "@wlq/wlq-core/lib";
import { RoomCodec, RoomKey } from "@wlq/wlq-core/lib/model";
import DynamoDB from "aws-sdk/clients/dynamodb";

const TableName = process.env.ROOM_TABLE_NAME!;

const roomComposite = ({ roomId }: RoomKey) => ({ PK: roomId, SK: "#" });

export function newRoomStore(
  DB: DynamoDB.DocumentClient
): Pick<IStore, "addRoom" | "getRoom"> {
  return {
    async addRoom(room) {
      await DB.put({
        TableName,
        Item: { ...room, ...roomComposite(room) },
        ConditionExpression: "attribute_not_exists(PK)"
      }).promise();
      return room;
    },

    async getRoom(roomKey) {
      const result = await DB.get({
        TableName,
        Key: roomComposite(roomKey)
      }).promise();
      if (!result.Item) throw new NotFoundStoreError("Room not found");
      return resolveCodecEither(RoomCodec.decode(result.Item));
    }
  };
}
