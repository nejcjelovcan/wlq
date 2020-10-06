import getDatabaseProps from '../getDatabaseProps'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'
import leaveRoom from '@wlq/wlq-api/src/room/leaveRoom'
import { APIGatewayProxyHandler } from 'aws-lambda'
import deleteParticipantCallback from '../callbacks/deleteParticipantCallback'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const websocketEventData = extractFromWebsocketEvent(event, context)
  const { connectionId, routeKey } = websocketEventData

  switch (routeKey) {
    case '$connect':
      console.log('CONNECT')
      break
    case '$disconnect':
      console.log('DISCONNECT')

      if (connectionId) {
        return awsWebsocketWrapper(
          { connectionId, action: 'leaveRoom', data: {} },
          websocketEventData,
          leaveRoom(
            getParticipantCallback(DbProps),
            deleteParticipantCallback(DbProps),
          ),
        )
      }
  }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
