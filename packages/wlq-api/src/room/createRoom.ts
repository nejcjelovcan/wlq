import { Room, newRoom, validateRoomCreation } from '@wlq/wlq-model/src/room'
import { GetRoomResponseData } from '.'
import { RestRequest, RestResponse } from '../rest'

const createRoom = async (
  request: RestRequest,
  addRoom: (room: Room) => Promise<Room>,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = newRoom(validateRoomCreation(request.data))
  room = await addRoom(room)
  return { statusCode: 200, data: { room } }
}

export default createRoom
