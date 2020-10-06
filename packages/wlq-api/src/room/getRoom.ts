import { GetRoomResponseData, GetRoomCallback } from '.'
import { RestRequest, RestResponse, RestResponseError } from '../rest'

const getRoom = async (
  request: RestRequest,
  getRoomByRoomId: GetRoomCallback,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = await getRoomByRoomId(request.data.roomId)
  if (!room) {
    throw new RestResponseError(404, 'Room not found')
  }
  return { statusCode: 200, data: { room } }
}

export default getRoom
