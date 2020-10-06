import { newRoom, validateRoomCreation } from '@wlq/wlq-model/src/room'
import { GetRoomResponseData, PutRoomCallback } from '.'
import { RestRequest, RestResponse } from '../rest'

const createRoom = async (
  request: RestRequest,
  putRoom: PutRoomCallback,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = newRoom(validateRoomCreation(request.data))
  room = await putRoom(room)
  return { statusCode: 200, data: { room } }
}

export default createRoom
