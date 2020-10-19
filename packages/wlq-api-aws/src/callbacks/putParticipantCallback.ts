import { PutParticipantCallback } from '@wlq/wlq-api/src/room'
import { getRoomParticipantKeys, getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const putParticipantCallback = ({
  DB,
  TableName,
}: DatabaseProps): PutParticipantCallback => async participant => {
  await DB.put({
    TableName,
    Item: { ...participant, ...getRoomParticipantKeys(participant) },
    ConditionExpression: 'attribute_not_exists(PK)',
  }).promise()
  await DB.update({
    TableName,
    Key: getRoomKeys({ roomId: participant.roomId }),
    UpdateExpression: 'SET participantCount = participantCount + :inc',
    ExpressionAttributeValues: {
      ':inc': 1,
    },
  }).promise()
  return participant
}
export default putParticipantCallback
