import { GetRoomCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys, Room } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const getRoomByRoomIdCallback = ({
  DB,
  TableName,
}: DatabaseProps): GetRoomCallback => async (roomId: string) => {
  const result = await DB.get({
    TableName,
    Key: getRoomKeys({ roomId }),
  }).promise()

  return {
    ...(result.Item as Room),
    ws: `wss://${process.env.WEBSOCKET_ENDPOINT}`,
  }
}
export default getRoomByRoomIdCallback
