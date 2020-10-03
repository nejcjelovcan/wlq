import { Room, newRoom, validateRoomCreation } from '@wlq/wlq-model/src/room'
import { GetRoomResponseData } from '.'
import { RestRequest, RestResponse } from '../rest'

const createRoom = async (
  request: RestRequest,
  onCreate: (room: Room) => Promise<any>,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = newRoom(validateRoomCreation(request.data))
  await onCreate(room)
  return { statusCode: 200, data: { room } }
}

export default createRoom
