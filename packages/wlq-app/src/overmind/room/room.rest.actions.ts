import { GetRoomResponseData } from '@wlq/wlq-api/src/room'
import { AsyncAction } from 'overmind'

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
    room.roomSession = { participants: [], usersAnswered: [], itemAnswers: {} }
    room.socket = {}

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
    room.roomSession = { participants: [], usersAnswered: [], itemAnswers: {} }
    room.socket = {}
  } catch (e) {
    room.getRoomRequest.error = e.message
  } finally {
    room.getRoomRequest.loading = false
  }
}
