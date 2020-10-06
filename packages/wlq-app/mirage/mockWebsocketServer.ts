import answerQuestion from '@wlq/wlq-api/src/room/answerQuestion'
import joinRoom from '@wlq/wlq-api/src/room/joinRoom'
import startGame from '@wlq/wlq-api/src/room/startGame'
import leaveRoom from '@wlq/wlq-api/src/room/leaveRoom'
import { Server as SocketServer, WebSocket } from 'mock-socket'
import { ServerSchema } from '.'
import {
  deleteParticipant,
  getParticipant,
  getRoomByRoomId,
  getRoomParticipants,
  putParticipant,
  putRoom,
  verifyToken,
} from './mirage.helpers'
import mockWebsocketWrapper from './mockWebsocketWrapper'

export const WS = 'ws://localhost:3000/ws'

let wsServer: SocketServer = undefined

const mockWebsocketServer = async (schema: ServerSchema) => {
  if (typeof window !== 'undefined') window.WebSocket = WebSocket

  // TODO
  if (wsServer) {
    await new Promise(resolve => wsServer.stop(resolve))
  }
  wsServer = new SocketServer(WS)

  wsServer.on('connection', socket => {
    socket.on('message', async message => {
      const { action, data } = JSON.parse(message.toString())
      switch (action) {
        case 'joinRoom':
          await mockWebsocketWrapper(
            {
              connectionId: 'connectionId',
              action: 'joinRoom',
              data,
            },
            socket,
            joinRoom(
              getRoomByRoomId(schema),
              verifyToken,
              putParticipant(schema),
              getRoomParticipants(schema),
            ),
          )
          return
        case 'startGame':
          await mockWebsocketWrapper(
            {
              connectionId: 'connectionId',
              action: 'startGame',
              data,
            },
            socket,
            startGame(
              getParticipant(schema),
              getRoomByRoomId(schema),
              putRoom(schema),
            ),
          )
          return
        case 'answerQuestion':
          await mockWebsocketWrapper(
            {
              connectionId: 'connectionId',
              action: 'answerQuestion',
              data,
            },
            socket,
            answerQuestion(
              getParticipant(schema),
              getRoomByRoomId(schema),
              putRoom(schema),
            ),
          )
          return
      }
    })
    socket.on('close', async () => {
      await mockWebsocketWrapper(
        {
          connectionId: 'connectionId',
          action: 'leaveRoom',
          data: {},
        },
        socket,
        leaveRoom(getParticipant(schema), deleteParticipant(schema)),
      )
    })
  })
}
export default mockWebsocketServer
