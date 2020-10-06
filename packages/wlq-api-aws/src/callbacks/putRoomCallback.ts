import { PutRoomCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const putRoomCallback = ({
  DB,
  TableName,
}: DatabaseProps): PutRoomCallback => async room => {
  await DB.put({
    TableName,
    Item: {
      ...room,
      ...getRoomKeys(room),
    },
    ConditionExpression: 'attribute_not_exists(PK)',
  }).promise()
  return { ...room, ws: process.env.WEBSOCKET_ENDPOINT }
}
export default putRoomCallback
