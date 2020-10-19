import { getRoomPublic } from '@wlq/wlq-model/src/room'
import { ListRoomsCallback, ListRoomsResponseData } from '.'
import { RestResponse } from '../rest'

const listRooms = async (
  listRoomsCallback: ListRoomsCallback,
): Promise<RestResponse<ListRoomsResponseData>> => {
  let rooms = (await listRoomsCallback()).map(getRoomPublic)
  return { statusCode: 200, data: { rooms } }
}

export default listRooms
