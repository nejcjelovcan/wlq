import getDatabaseProps from '@wlq/wlq-api-aws/src/getDatabaseProps'
import awsWebsocketWrapper from '@wlq/wlq-api-aws/src/wrappers/awsWebsocketWrapper'
import leaveRoom from '@wlq/wlq-api/src/room/leaveRoom'
import { APIGatewayProxyHandler } from 'aws-lambda'
import deleteParticipantCallback from '../callbacks/deleteParticipantCallback'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'

const DbProps = getDatabaseProps()

// TODO We should disconnect clients that haven't joinRoom in a short time
export const handler: APIGatewayProxyHandler = async event => {
  const {
    connectionId,
    routeKey,
    websocketEndpoint,
  } = extractFromWebsocketEvent(event)

  switch (routeKey) {
    case '$connect':
      console.log('CONNECT')
      break
    case '$disconnect':
      console.log('DISCONNECT')

      if (connectionId) {
        return awsWebsocketWrapper(
          { connectionId, action: 'leaveRoom', data: {} },
          websocketEndpoint,
          leaveRoom(
            getParticipantCallback(DbProps),
            deleteParticipantCallback(DbProps),
          ),
        )
      }
  }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
