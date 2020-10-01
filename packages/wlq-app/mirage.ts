// mirage.js
import Response from '@wlq/wlq-api/src/rest/Response'
import { Response as MirageResponse, Server, Model } from 'miragejs'
import { GetTokenResponseData } from '@wlq/wlq-api/src/user/getToken'

const respond = (response: Response): MirageResponse =>
  new MirageResponse(response.statusCode, undefined, response.data)

export function makeServer({ environment = 'test' } = {}) {
  let server = new Server({
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

      // in this case we can't use the common api function
      // because jose (jwt library) is not browser ready
      this.get('/getToken', () => {
        // we do have a typescript check here in case we change the
        // ResponseData type
        const data: GetTokenResponseData = { token: 'token' }
        return respond({ statusCode: 200, data })
      })
    },
  })

  return server
}
