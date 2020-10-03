// mirage.js
import {
  createRoom,
  getRoom,
  GetTokenResponseData,
  RestResponse,
} from '@wlq/wlq-api/src'
import { Room, RoomParticipant } from '@wlq/wlq-model/src'
import { Model, Registry, Server } from 'miragejs'
import { ModelDefinition } from 'miragejs/-types'
import Schema from 'miragejs/orm/schema'
import { getRoomByRoomId } from './helpers'
import makeWsServer from './makeWsServer'
import respond from './respondMirage'

// In case of getToken we can't use the common api function
// because jose (jwt library) is not browser ready
// We're still enforcing endpoint signature with typescript, though
const mirageGetToken = (): RestResponse<GetTokenResponseData> => ({
  statusCode: 200,
  data: { token: 'testtoken' },
})

type ServerRegistry = Registry<
  {
    room: ModelDefinition<Room>
    participant: ModelDefinition<RoomParticipant>
  },
  {}
>
export type ServerSchema = Schema<ServerRegistry>

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
          createRoom({ data: JSON.parse(request.requestBody) }, async room =>
            schema.create('room', room),
          ),
        ),
      )
      this.post('/getRoom', async (schema: ServerSchema, request) =>
        respond(() =>
          getRoom({ data: JSON.parse(request.requestBody) }, async roomId =>
            getRoomByRoomId(schema, roomId),
          ),
        ),
      )
    },
  })

  makeWsServer(server.schema)

  return server
}
