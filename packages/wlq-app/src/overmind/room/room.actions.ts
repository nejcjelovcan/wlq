import { GetRoomResponseData, RoomJoinProps } from '@wlq/wlq-api/src/room'
import { RoomCreation, validateRoomCreation } from '@wlq/wlq-model/src/room'
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

export const roomOnOpen: Action = ({
  state: {
    user: { token, details },
    room: { socket, currentRoom },
  },
  effects: { websocket },
}) => {
  if (token && currentRoom && details) {
    console.log('WEBSOCKET OPEN')
    socket.loading = false
    socket.connected = true
    websocket.sendMessage<RoomJoinProps>({
      action: 'joinRoom',
      data: { token, roomId: currentRoom?.roomId, userDetails: details },
    })
  }
}

export const roomOnClose: Action = ({
  state: {
    room: { socket },
  },
}) => {
  console.log('WEBSOCKET CLOSE')
  socket.loading = false
  socket.connected = false
}

export const roomOnError: Action<Event> = (
  {
    state: {
      room: { socket },
    },
  },
  event,
) => {
  console.log('WEBSOCKET ERROR', event)
  socket.error = 'Socket error'
}

export const roomOnMessage: Action<MessageEvent> = (_, event) => {
  console.log('MESSAGE RECEIVED', event.data)
}

export const joinRoom: Action = ({
  state: {
    user: { token, details },
    room: { currentRoom, socket },
  },
  actions: {
    room: { roomOnOpen, roomOnMessage, roomOnClose, roomOnError },
  },
  effects: { websocket },
}) => {
  console.log('JOIN ROOM!', token, currentRoom?.ws, details)
  if (token && currentRoom?.ws && details && !socket.connected) {
    console.log('JOINING!')
    socket.loading = true
    websocket.initialize(currentRoom?.ws)
    websocket.setOnOpen(() => {
      roomOnOpen()
    })
    websocket.setOnMessage(ev => {
      roomOnMessage(ev)
    })
    websocket.setOnClose(() => {
      roomOnClose()
    })
    websocket.setOnError(ev => {
      roomOnError(ev)
    })
  }
}

export const leaveRoom: Action = ({
  state: {
    room: {
      socket: { connected },
    },
  },
  effects: { websocket },
}) => {
  if (connected) {
    websocket.close()
  }
}
