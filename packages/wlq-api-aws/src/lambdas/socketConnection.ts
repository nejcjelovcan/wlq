import { APIGatewayProxyHandler } from 'aws-lambda'

// TODO We should disconnect clients that haven't joinRoom in a short time
export const handler: APIGatewayProxyHandler = async ({
  requestContext: { routeKey },
}) => {
  // const websocketApi = getWebsocketApi(domainName, stage)

  // if (routeKey === '$connect') {
  //   console.log('CONNECT')
  // }

  if (routeKey === '$disconnect') {
    console.log('DISCONNECT')
    // try {
    //   await leaveRoom({ connectionId })
    // } catch (e) {
    //   console.error('Error disconnecting', e)
    //
    // }
  }

  return { statusCode: 200, body: '' }
}
