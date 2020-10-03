import { RestRespondFunction, RestResponseError } from '@wlq/wlq-api/src/rest'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { Response as MirageResponse } from 'miragejs'

const respondMirage: RestRespondFunction<MirageResponse> = async responseGenerator => {
  try {
    let response = responseGenerator()
    if (response instanceof Promise) response = await response
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
export default respondMirage
