import { GetRoomResponseData } from '@wlq/wlq-api/src/room/getRoom'
import {
  RoomCreation,
  validateRoomCreation,
} from '@wlq/wlq-model/src/room/Room'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { Action, AsyncAction } from 'overmind'

export const setRoomCreation: Action<Partial<RoomCreation>> = (
  { state: { room } },
  roomCreation,
) => {
  room.roomCreation = roomCreation
  room.roomCreationError = undefined
  try {
    room.roomCreation = validateRoomCreation(roomCreation)
    room.roomCreationValid = true
  } catch (e) {
    if (e instanceof ValidationError) {
      room.roomCreationError = { field: e.field, message: e.message }
    }
    room.roomCreationValid = false
  }
}

export const createRoom: AsyncAction = async ({
  state: {
    room,
    user: { token },
  },
  effects: { api },
}) => {
  try {
    room.roomCreationRequest = { loading: true }

    const createdRoom = await api.apiPost<GetRoomResponseData>(
      'createRoom',
      token!,
      room.roomCreation,
    )
    room.currentRoom = createdRoom.room

    // TODO
    room.roomCreation = {}
    room.roomCreationError = undefined
    room.roomCreationValid = undefined
  } catch (e) {
    room.roomCreationError = e.message
    room.roomCreationRequest.error = e.message
  } finally {
    room.roomCreationRequest.loading = false
  }
}

export const getRoom: AsyncAction<string> = async (
  {
    state: {
      room,
      user: { token },
    },
    effects: { api },
  },
  roomId,
) => {
  try {
    room.getRoomRequest = { loading: true }

    const responseData = await api.apiPost<GetRoomResponseData>(
      'getRoom',
      token!,
      {
        roomId,
      },
    )
    room.currentRoom = responseData.room
  } catch (e) {
    room.getRoomRequest.error = e.message
  } finally {
    room.getRoomRequest.loading = false
  }
}
