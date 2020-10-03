import { Room, RoomParticipant, getRoomPK } from '@wlq/wlq-model/src/room'

const getRoomAndParticipantsByRoomId = async (
  DB: AWS.DynamoDB.DocumentClient,
  TableName: string,
  roomId: string,
): Promise<[Room | undefined, RoomParticipant[]]> => {
  const query = {
    TableName,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': getRoomPK({ roomId }),
    },
    ScanIndexForward: true,
  }
  const result = await DB.query(query).promise()

  if (Array.isArray(result.Items) && result.Items.length > 0) {
    return [result.Items[0] as Room, result.Items.slice(1) as RoomParticipant[]]
  }

  return [undefined, []]
}
export default getRoomAndParticipantsByRoomId
