import { PutRoomCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const putRoomCallback = ({
  DB,
  TableName,
}: DatabaseProps): PutRoomCallback => async (room, update = false) => {
  await DB.put({
    TableName,
    Item: {
      ...room,
      ...getRoomKeys(room),
    },
    ConditionExpression: update ? undefined : 'attribute_not_exists(PK)',
  }).promise()
  return { ...room, ws: `wss://${process.env.WEBSOCKET_ENDPOINT}` }
}
export default putRoomCallback
