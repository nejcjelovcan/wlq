// mirage.js
import {
  RestRespondFunction,
  RestResponse,
  RestResponseError,
} from '@wlq/wlq-api/src/rest'
import { GetTokenResponseData } from '@wlq/wlq-api/src/user/getToken'
import createRoom from '@wlq/wlq-api/src/room/createRoom'
import Room from '@wlq/wlq-model/src/room/Room'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { Model, Registry, Response as MirageResponse, Server } from 'miragejs'
import Schema from 'miragejs/orm/schema'
import { ModelDefinition } from 'miragejs/-types'

const respond: RestRespondFunction<MirageResponse> = async responseGenerator => {
  try {
    const response =
      responseGenerator instanceof Promise
        ? await responseGenerator
        : responseGenerator()
    return new MirageResponse(response.statusCode, undefined, response.data)
  } catch (e) {
    if (e instanceof RestResponseError) {
      return new MirageResponse(e.statusCode, undefined, { error: e.message })
    } else if (e instanceof ValidationError) {
      return new MirageResponse(400, undefined, {
        error: e.message,
        field: e.field,
      })
    }
    return new MirageResponse(500, undefined, e.message)
  }
}

// In case of getToken we can't use the common api function
// because jose (jwt library) is not browser ready
// We're still enforcing endpoint signature with typescript, though
const mirageGetToken = (): RestResponse<GetTokenResponseData> => ({
  statusCode: 200,
  data: { token: 'testtoken' },
})

type ServerRegistry = Registry<{ room: ModelDefinition<Room> }, {}>
type ServerSchema = Schema<ServerRegistry>

export function makeServer({ environment = 'test' } = {}) {
  let server = new Server<ServerRegistry>({
    environment,

    models: {
      room: Model,
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
    },
  })

  return server
}
