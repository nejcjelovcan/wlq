import { RestRequest, RestResponse } from '../rest'

import Room, {
  newRoom,
  validateRoomCreation,
} from '@wlq/wlq-model/src/room/Room'
import { GetRoomResponseData } from './getRoom'

const createRoom = async (
  request: RestRequest,
  onCreate: (room: Room) => Promise<any>,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = newRoom(validateRoomCreation(request.data))
  room = await onCreate(room)
  return { statusCode: 200, data: { room } }
}

export default createRoom
