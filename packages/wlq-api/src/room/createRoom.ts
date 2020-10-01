import Request from '../rest/Request'
import Response from '../rest/Response'

import Room, { newRoom, RoomCreation } from '@wlq/wlq-model/src/room/Room'

const createRoom = async (
  request: Request<RoomCreation>,
  onCreate: (room: Room) => Promise<void>,
): Promise<Response> => {
  const room = newRoom(request.data)
  await onCreate(room)
  return { statusCode: 200, data: { room } }
}

export default createRoom
