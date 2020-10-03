import {
  joinRoom,
  newWsMessageEvent,
  wsEventConsumer,
  WsSendFunction,
} from '@wlq/wlq-api/src'
import { Server as SocketServer, WebSocket } from 'mock-socket'
import { ServerSchema } from './'
import { getRoomAndParticipantsByRoomId, getRoomByRoomId } from './helpers'

export const WS = 'ws://localhost:3000/ws'

let wsServer: SocketServer = undefined

const makeWsServer = async (schema: ServerSchema) => {
  if (typeof window !== 'undefined') window.WebSocket = WebSocket

  // TODO
  if (wsServer) {
    await new Promise(resolve => wsServer.stop(resolve))
  }
  wsServer = new SocketServer(WS)

  wsServer.on('connection', socket => {
    const send: WsSendFunction = async ({ connectionId, message }) => {
      socket.send(JSON.stringify(message))
    }

    socket.on('message', async message => {
      const { action, data } = JSON.parse(message.toString())
      switch (action) {
        case 'joinRoom':
          return wsEventConsumer(
            newWsMessageEvent('connectionId', 'joinRoom', data),
            joinRoom(
              async () => 'uid',
              async roomId => getRoomByRoomId(schema, roomId),
              async roomId => getRoomAndParticipantsByRoomId(schema, roomId),
              async participant => schema.create('participant', participant),
            ),
            send,
          )
      }
    })
    socket.on('close', () => {})
  })
}
export default makeWsServer
