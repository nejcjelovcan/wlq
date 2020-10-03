import { getRoomKeys, Room } from '@wlq/wlq-model/src/room'

const getRoomByRoomId = async (
  DB: AWS.DynamoDB.DocumentClient,
  TableName: string,
  roomId: string,
): Promise<Room | undefined> => {
  // TODO room's listed property should be a sparse index, not a part of GSI
  // (then we also won't need batchGet here)
  const result = await DB.batchGet({
    RequestItems: {
      [TableName]: {
        Keys: [
          getRoomKeys({ roomId, listed: false }),
          getRoomKeys({ roomId, listed: true }),
        ],
      },
    },
  }).promise()

  if (
    result.Responses &&
    Array.isArray(result.Responses[TableName]) &&
    result.Responses[TableName].length === 1
  ) {
    return result.Responses[TableName][0] as Room
  }
  return undefined
}
export default getRoomByRoomId
