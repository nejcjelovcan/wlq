import { APIGatewayProxyHandler } from 'aws-lambda'
import { COMMON_HEADERS } from '../respond'

// TODO We should disconnect clients that haven't joinRoom in a short time
export const handler: APIGatewayProxyHandler = async ({
  requestContext: { routeKey },
}) => {
  // const websocketApi = getWebsocketApi(domainName, stage)

  // if (routeKey === '$connect') {
  //   console.log('CONNECT')
  // }
  switch (routeKey) {
    case '$connect':
      console.log('CONNECT')
      break
    case '$disconnect':
      console.log('DISCONNECT')
      break
  }

  // try {
  //   await leaveRoom({ connectionId })
  // } catch (e) {
  //   console.error('Error disconnecting', e)
  //
  // }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
