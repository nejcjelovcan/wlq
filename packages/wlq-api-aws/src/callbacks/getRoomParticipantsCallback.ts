import { GetRoomParticipantsCallback } from '@wlq/wlq-api/src/room'
import { getRoomPK, RoomParticipant } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const getRoomParticipantsCallback = ({
  DB,
  TableName,
}: DatabaseProps): GetRoomParticipantsCallback => async (roomId: string) => {
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
    return result.Items.filter(
      item => item.type === 'RoomParticipant',
    ) as RoomParticipant[]
  }

  return []
}
export default getRoomParticipantsCallback
