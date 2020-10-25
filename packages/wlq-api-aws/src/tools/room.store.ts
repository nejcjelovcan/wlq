import {
  IStore,
  NotFoundStoreError,
  resolveCodecEither
} from "@wlq/wlq-core/lib";
import {
  ParticipantCodec,
  ParticipantKey,
  Room,
  RoomCodec,
  RoomKey
} from "@wlq/wlq-core/lib/model";
import DynamoDB from "aws-sdk/clients/dynamodb";

const TableName = process.env.ROOM_TABLE_NAME!;

export function newRoomStore(
  DB: DynamoDB.DocumentClient
): Pick<IStore, "addRoom" | "getRoom" | "getParticipants" | "addParticipant"> {
  return {
    async addRoom(room) {
      await DB.put({
        TableName,
        Item: { ...room, ...roomComposite(room) },
        ConditionExpression: "attribute_not_exists(PK)"
      }).promise();
      // TODO handle exists error and throw ExistsStoreError
      return room;
    },

    async getRoom(roomKey) {
      const result = await DB.get({
        TableName,
        Key: roomComposite(roomKey)
      }).promise();
      if (!result.Item) throw new NotFoundStoreError("Room not found");
      return resolveCodecEither(RoomCodec.decode(result.Item));
    },

    async getParticipants(roomKey) {
      const query = {
        TableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": roomComposite(roomKey).PK
        },
        ScanIndexForward: true
      };
      const result = await DB.query(query).promise();

      if (Array.isArray(result.Items) && result.Items.length > 0) {
        return result.Items.filter(
          item => item.type === "RoomParticipant"
        ).map(item => resolveCodecEither(ParticipantCodec.decode(item)));
      }

      return [];
    },

    async addParticipant(participant) {
      await DB.put({
        TableName,
        Item: { ...participant, ...participantComposite(participant) },
        ConditionExpression: "attribute_not_exists(PK)"
      }).promise();
      // TODO handle exists error and throw ExistsStoreError

      // update room count
      return await updateRoomCount(DB, participant, 1);
    }
  };
}

const roomComposite = ({ roomId }: RoomKey) => ({ PK: roomId, SK: "#" });

const participantComposite = ({
  roomId,
  connectionId
}: RoomKey & ParticipantKey) => ({
  PK: roomId,
  SK: `PARTICIPANT#${connectionId}`
});

const updateRoomCount = async (
  DB: DynamoDB.DocumentClient,
  roomKey: RoomKey,
  increase: number
): Promise<Room> => {
  const result = await DB.update({
    TableName,
    Key: roomComposite(roomKey),
    UpdateExpression: "SET participantCount = participantCount + :inc",
    ExpressionAttributeValues: {
      ":inc": increase
    }
  }).promise();
  return resolveCodecEither(RoomCodec.decode(result.Attributes));
};
