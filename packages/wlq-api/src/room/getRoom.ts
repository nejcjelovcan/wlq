import { RestRequest, RestResponse, RestResponseError } from '../rest'
import Room from '@wlq/wlq-model/src/room/Room'

export type GetRoomResponseData = {
  room: Room
}

const getRoom = async (
  request: RestRequest,
  roomGetter: (roomId: string) => Promise<Room | undefined>,
): Promise<RestResponse<GetRoomResponseData>> => {
  let room = await roomGetter(request.data.roomId)
  if (!room) {
    throw new RestResponseError(404, 'Room not found')
  }
  return { statusCode: 200, data: { room } }
}

export default getRoom
