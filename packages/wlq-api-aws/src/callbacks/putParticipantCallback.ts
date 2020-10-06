import { PutParticipantCallback } from '@wlq/wlq-api/src/room'
import { getRoomParticipantKeys } from '@wlq/wlq-model/src/room'
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
  return participant
}
export default putParticipantCallback
