import {
  joinRoom,
  leaveRoom,
  startGame,
  newWsMessageEvent,
  wsEventConsumer,
  WsSendFunction,
} from '@wlq/wlq-api/src'
import { Server as SocketServer, WebSocket } from 'mock-socket'
import { ServerSchema } from './'
import {
  getRoomAndParticipantsByRoomId,
  getRoomByRoomId,
  getRoomParticipantByConnectionId,
} from './helpers'

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
    const roomAndParticipantsGetter = async (roomId: string) =>
      getRoomAndParticipantsByRoomId(schema, roomId)
    const roomParticipantGetter = async (connectionId: string) =>
      getRoomParticipantByConnectionId(schema, connectionId)

    socket.on('message', async message => {
      const { action, data } = JSON.parse(message.toString())
      switch (action) {
        case 'joinRoom':
          await wsEventConsumer(
            newWsMessageEvent('connectionId', 'joinRoom', data),
            joinRoom(
              async () => 'uid',
              async roomId => getRoomByRoomId(schema, roomId),
              roomAndParticipantsGetter,
              async participant => schema.create('participant', participant),
            ),
            send,
          )
          return
        case 'startGame':
          await wsEventConsumer(
            newWsMessageEvent('connectionId', 'startGame', {}),
            startGame(
              roomParticipantGetter,
              roomAndParticipantsGetter,
              async ({ roomId }, update) => {
                schema.findBy('room', { roomId }).update(update)
                return getRoomByRoomId(schema, roomId)
              },
            ),
            send,
          )
      }
    })
    socket.on('close', async () => {
      await wsEventConsumer(
        newWsMessageEvent('connectionId', 'leaveRoom', {}),
        leaveRoom(
          roomParticipantGetter,
          async participant =>
            schema
              .findBy('participant', {
                connectionId: participant.connectionId,
              })
              .destroy(),
          roomAndParticipantsGetter,
        ),
        send,
      )
    })
  })
}
export default makeWsServer
