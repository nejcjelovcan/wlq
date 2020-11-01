import { decodeThrow, IStore, NotFoundStoreError } from "@wlq/wlq-core/lib";
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
): Pick<
  IStore,
  | "addRoom"
  | "getRoom"
  | "getParticipants"
  | "getParticipant"
  | "addParticipant"
  | "deleteParticipant"
  | "setGameQuestion"
  | "startGame"
  | "setGameQuestionToken"
  | "setGameToAnswerState"
  | "setGameToFinishedState"
  | "addAnswer"
> {
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
      return decodeThrow(RoomCodec, result.Item);
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
          item => item.type === "Participant"
        ).map(item => decodeThrow(ParticipantCodec, item));
      }

      return [];
    },

    async getParticipant(key) {
      const result = await DB.query({
        TableName,
        IndexName: "InverseIndex",
        KeyConditionExpression: "SK = :sk",
        ExpressionAttributeValues: {
          ":sk": participantSk(key)
        },
        ScanIndexForward: true
      }).promise();
      if (Array.isArray(result.Items) && result.Items.length === 1) {
        return decodeThrow(ParticipantCodec, result.Items[0]);
      }

      throw new NotFoundStoreError("Participant not found");
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
    },

    async deleteParticipant(key) {
      await DB.delete({
        TableName,
        Key: participantComposite(key)
      }).promise();

      return await updateRoomCount(DB, key, -1);
    },

    async setGameQuestion(roomKey, game, question) {
      const result = await DB.update({
        TableName,
        Key: roomComposite(roomKey),
        UpdateExpression: "SET game = :game",
        ConditionExpression: `#current = :expectedCurrent
            AND game.#current IN (:expectedGameCurrent1, :expectedGameCurrent2)`,
        ExpressionAttributeValues: {
          ":game": {
            ...game,
            questionIndex: game.questionIndex + 1,
            current: "Question",
            question: question,
            questionToken: "",
            answers: []
          },
          ":expectedCurrent": "Game",
          ":expectedGameCurrent1": "Idle",
          ":expectedGameCurrent2": "Answer"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    },

    async setGameQuestionToken(roomKey, questionToken) {
      const result = await DB.update({
        TableName,
        Key: roomComposite(roomKey),
        UpdateExpression: "SET game.questionToken = :questionToken",
        ConditionExpression:
          "#current = :expectedCurrent AND game.#current = :expectedGameCurrent",
        ExpressionAttributeValues: {
          ":questionToken": questionToken,
          ":expectedCurrent": "Game",
          ":expectedGameCurrent": "Question"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    },

    async setGameToAnswerState(roomKey) {
      const result = await DB.update({
        TableName,
        Key: roomComposite(roomKey),
        UpdateExpression: "SET game.#current = :gameCurrent",
        ConditionExpression:
          "#current = :expectedCurrent AND game.#current = :expectedGameCurrent",
        ExpressionAttributeValues: {
          ":gameCurrent": "Answer",
          ":expectedCurrent": "Game",
          ":expectedGameCurrent": "Question"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    },

    async setGameToFinishedState(roomKey, game) {
      const result = await DB.update({
        TableName,
        Key: roomComposite(roomKey),
        UpdateExpression: "SET game = :game",
        ConditionExpression:
          "#current = :expectedCurrent AND game.#current = :expectedGameCurrent",
        ExpressionAttributeValues: {
          ":game": {
            ...game,
            current: "Finished"
          },
          ":expectedCurrent": "Game",
          ":expectedGameCurrent": "Answer"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    },

    async startGame(roomKey, questionCount) {
      const result = await DB.update({
        TableName,
        Key: roomComposite(roomKey),
        UpdateExpression: "SET #current = :current, game = :game",
        ConditionExpression: "#current = :expectedCurrent",
        ExpressionAttributeValues: {
          ":current": "Game",
          ":game": {
            type: "Game",
            current: "Idle",
            questionCount,
            questionIndex: 0
          },
          ":expectedCurrent": "Idle"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    },

    async addAnswer({ roomId, pid }, answer) {
      const result = await DB.update({
        TableName,
        Key: roomComposite({ roomId }),
        UpdateExpression:
          "SET game.answers = list_append(game.answers, :answers)",
        ConditionExpression:
          "#current = :expectedCurrent AND game.#current = :expectedGameCurrent",
        ExpressionAttributeValues: {
          ":answers": [{ pid, answer }],
          ":expectedCurrent": "Game",
          ":expectedGameCurrent": "Question"
        },
        ExpressionAttributeNames: {
          "#current": "current"
        },
        ReturnValues: "ALL_NEW"
      }).promise();

      // TODO throw State error if condition fails
      return decodeThrow(RoomCodec, result.Attributes);
    }
  };
}

const roomComposite = ({ roomId }: RoomKey) => ({ PK: roomId, SK: "#" });

const participantSk = ({ connectionId }: ParticipantKey) =>
  `PARTICIPANT#${connectionId}`;

const participantComposite = ({
  roomId,
  connectionId
}: RoomKey & ParticipantKey) => ({
  PK: roomId,
  SK: participantSk({ connectionId })
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
    },
    ReturnValues: "ALL_NEW"
  }).promise();
  return decodeThrow(RoomCodec, result.Attributes);
};
