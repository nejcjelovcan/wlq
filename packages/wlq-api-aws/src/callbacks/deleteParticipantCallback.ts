import { DeleteParticipantCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys, getRoomParticipantKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const deleteParticipantCallback = ({
  DB,
  TableName,
}: DatabaseProps): DeleteParticipantCallback => async participant => {
  await DB.delete({
    TableName,
    Key: getRoomParticipantKeys(participant),
  }).promise()
  await DB.update({
    TableName,
    Key: getRoomKeys({ roomId: participant.roomId }),
    UpdateExpression: 'SET participantCount = participantCount - :dec',
    ExpressionAttributeValues: {
      ':dec': 1,
    },
  }).promise()
  return
}
export default deleteParticipantCallback
