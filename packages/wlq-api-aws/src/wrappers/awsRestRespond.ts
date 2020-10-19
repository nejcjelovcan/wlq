import { RestRespondFunction, RestResponseError } from '@wlq/wlq-api/src/rest'
import { ValidationError } from '@wlq/wlq-model/src/validation'
import { APIGatewayProxyResult } from 'aws-lambda'

export const COMMON_HEADERS = {
  'Access-Control-Allow-Origin': process.env.HTTP_ORIGIN!,
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
}

const formatBody = (data: { [key: string]: any }) =>
  JSON.stringify(data, null, '  ')

const restRespond: RestRespondFunction<APIGatewayProxyResult> = async responseGenerator => {
  try {
    let response = responseGenerator()
    if (response instanceof Promise) response = await response
    return {
      statusCode: response.statusCode,
      headers: COMMON_HEADERS,
      body: formatBody(response.data),
    }
  } catch (e) {
    if (e instanceof RestResponseError) {
      return {
        statusCode: e.statusCode,
        headers: COMMON_HEADERS,
        body: formatBody({ error: e.message }),
      }
    } else if (e instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: COMMON_HEADERS,
        body: formatBody({ error: e.message, field: e.field }),
      }
    }
  }
  return {
    statusCode: 500,
    headers: COMMON_HEADERS,
    body: formatBody({ error: 'Internal server error' }),
  }
}
export default restRespond
