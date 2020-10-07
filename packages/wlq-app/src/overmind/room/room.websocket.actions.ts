import { JoinRoomPayload } from '@wlq/wlq-api/src/room'
import { Action } from 'overmind'
import websocket from '../../utils/websocket'

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
    websocket.sendPayload<JoinRoomPayload>({
      action: 'joinRoom',
      data: { token, roomId: currentRoom?.roomId, userDetails: details },
    })
  }
}

export const roomOnClose: Action = ({ state: { room } }) => {
  console.log('WEBSOCKET CLOSE')
  room.socket.loading = false
  room.socket.connected = false
}

export const roomOnError: Action<Event | string> = (
  { state: { room } },
  event,
) => {
  console.log('WEBSOCKET ERROR', event)
  room.socket = {
    error: typeof event === 'string' ? event : 'Socket error',
    connected: false,
    loading: false,
  }
}

export const roomOnMessage: Action<MessageEvent> = (
  {
    actions: {
      room: {
        roomOnSetParticipants,
        roomOnUserJoined,
        roomOnUserLeft,
        roomOnUserAnswered,
        roomOnPoseQuestion,
        roomOnRevealAnswer,
        roomOnGameFinished,
        roomOnError,
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
      case 'poseQuestion':
        roomOnPoseQuestion(message.data)
        break
      case 'userAnswered':
        roomOnUserAnswered(message.data)
        break
      case 'revealAnswer':
        roomOnRevealAnswer(message.data)
        break
      case 'gameFinished':
        roomOnGameFinished(message.data)
        break
      case 'error':
        roomOnError(message.data.error)
        websocket.close()
        break
    }
  } catch (e) {}
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
