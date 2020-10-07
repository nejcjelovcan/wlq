import { SetRoomStateCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const setRoomStateCallback = ({
  DB,
  TableName,
}: DatabaseProps): SetRoomStateCallback => async (
  roomId: string,
  state: string,
) =>
  DB.update({
    TableName,
    Key: getRoomKeys({ roomId }),
    UpdateExpression: 'SET #state = :state',
    ExpressionAttributeNames: { '#state': 'state' },
    ExpressionAttributeValues: {
      ':state': state,
    },
  }).promise()

export default setRoomStateCallback
