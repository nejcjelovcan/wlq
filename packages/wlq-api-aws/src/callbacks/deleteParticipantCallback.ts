import { DeleteParticipantCallback } from '@wlq/wlq-api/lib/esm'
import { getRoomParticipantKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const deleteParticipantCallback = ({
  DB,
  TableName,
}: DatabaseProps): DeleteParticipantCallback => async participant => {
  await DB.delete({
    TableName,
    Key: getRoomParticipantKeys(participant),
  }).promise()
  return
}
export default deleteParticipantCallback
