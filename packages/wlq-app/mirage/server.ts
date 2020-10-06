// mirage.js
import createRoom from '@wlq/wlq-api/src/room/createRoom'
import getRoom from '@wlq/wlq-api/src/room/getRoom'
import { roomParticipantWithAliasFixture } from '@wlq/wlq-model/src/room/__tests__/room.fixtures'
import { Model, Server } from 'miragejs'
import { ServerRegistry, ServerSchema } from '.'
import { getRoomByRoomId, mirageGetToken, putRoom } from './mirage.helpers'
import mockWebsocketServer from './mockWebsocketServer'
import respond from './respondMirage'

export function makeServer({ environment = 'test' } = {}) {
  let server = new Server<ServerRegistry>({
    environment,

    models: {
      room: Model,
      participant: Model,
    },

    seeds(server) {
      const schema = server.schema as ServerSchema
      schema.create('room', {
        listed: false,
        name: 'Room1',
        roomId: 'testId',
        state: 'Idle',
        type: 'Room',
      })
      schema.create(
        'participant',
        roomParticipantWithAliasFixture('Annabelle', { roomId: 'testId' }),
      )
      schema.create(
        'participant',
        roomParticipantWithAliasFixture('Bobriard', { roomId: 'testId' }),
      )
      schema.create(
        'participant',
        roomParticipantWithAliasFixture('Schwarzenegger', { roomId: 'testId' }),
      )
    },

    routes() {
      this.passthrough(request => {
        if (request.url.startsWith('/_')) return true
        return false
      })

      this.namespace = process.env.NEXT_PUBLIC_API_URL || 'api'

      this.get('/getToken', async () => respond(mirageGetToken))
      this.post('/createRoom', async (schema: ServerSchema, request) =>
        respond(() =>
          createRoom(
            { data: JSON.parse(request.requestBody) },
            putRoom(schema),
          ),
        ),
      )
      this.post('/getRoom', async (schema: ServerSchema, request) =>
        respond(() =>
          getRoom(
            { data: JSON.parse(request.requestBody) },
            getRoomByRoomId(schema),
          ),
        ),
      )
    },
  })

  mockWebsocketServer(server.schema)

  return server
}
