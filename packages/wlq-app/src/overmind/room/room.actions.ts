import {
  GetRoomResponseData,
  RoomJoinProps,
  RoomSetParticipantsProps,
  RoomUpdateRoomProps,
  RoomUserJoinedProps,
  RoomUserLeftProps,
} from '@wlq/wlq-api/src/room'
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
    room.roomSession = { participants: [] }
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
    room.roomSession = { participants: [] }
    room.socket = {}
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

export const roomOnClose: Action = ({ state: { room } }) => {
  console.log('WEBSOCKET CLOSE')
  room.socket.loading = false
  room.socket.connected = false
  room.roomSession = { participants: [] }
}

export const roomOnError: Action<Event> = ({ state: { room } }, event) => {
  console.log('WEBSOCKET ERROR', event)
  room.socket = { error: 'Socket error', connected: false, loading: false }
  room.roomSession = { participants: [] }
}

export const roomOnMessage: Action<MessageEvent> = (
  {
    actions: {
      room: {
        roomOnSetParticipants,
        roomOnUserJoined,
        roomOnUserLeft,
        roomOnRoomUpdate,
      },
    },
  },
  event,
) => {
  try {
    const message = JSON.parse(event.data)
    console.log('ROOM ON MESSAGE', message)
    switch (message.action) {
      case 'setParticipants':
        roomOnSetParticipants(message.data)
        break
      case 'userJoined':
        roomOnUserJoined(message.data)
        break
      case 'userLeft':
        roomOnUserLeft(message.data)
        break
      case 'roomUpdate':
        roomOnRoomUpdate(message.data)
        break
    }
  } catch (e) {}
}

export const roomOnSetParticipants: Action<RoomSetParticipantsProps> = (
  { state: { room } },
  data,
) => {
  room.roomSession = {
    participants: data.participants,
    pid: data.pid,
  }
}

export const roomOnUserJoined: Action<RoomUserJoinedProps> = (
  { state: { room } },
  data,
) => {
  room.roomSession = {
    participants: [...room.roomSession.participants, data.participant],
  }
}

export const roomOnUserLeft: Action<RoomUserLeftProps> = (
  { state: { room } },
  data,
) => {
  room.roomSession = {
    participants: room.roomSession.participants.filter(
      p => p.pid !== data.participant.pid,
    ),
  }
}

export const roomOnRoomUpdate: Action<RoomUpdateRoomProps> = (
  { state: { room } },
  roomUpdate,
) => {
  if (room.currentRoom) {
    room.currentRoom = { ...room.currentRoom, ...roomUpdate }
  }
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
  console.log('SOCKET STATE', socket)
  if (
    token &&
    currentRoom?.ws &&
    details &&
    !socket.connected &&
    !socket.error
  ) {
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

export const startGame: Action = ({ effects: { websocket } }) => {
  websocket.sendMessage({
    action: 'startGame',
    data: {},
  })
}
