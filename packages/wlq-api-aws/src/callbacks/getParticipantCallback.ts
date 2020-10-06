import { GetParticipantCallback } from '@wlq/wlq-api/lib/esm'
import { RoomParticipant } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const getParticipantCallback = ({
  DB,
  TableName,
}: DatabaseProps): GetParticipantCallback => async (
  connectionId: string,
): Promise<RoomParticipant | undefined> => {
  const result = await DB.query({
    TableName,
    IndexName: 'InverseIndex',
    KeyConditionExpression: 'SK = :sk',
    ExpressionAttributeValues: {
      ':sk': `#ROOM_PARTICIPANT#${connectionId}`,
    },
    ScanIndexForward: true,
  }).promise()
  if (Array.isArray(result.Items) && result.Items.length === 1) {
    return (result.Items[0] as unknown) as RoomParticipant
  }
  return undefined
}
export default getParticipantCallback
