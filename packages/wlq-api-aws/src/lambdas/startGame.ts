import startGame from '@wlq/wlq-api/src/room/startGame'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import putRoomCallback from '../callbacks/putRoomCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async event => {
  const { connectionId, websocketEndpoint } = extractFromWebsocketEvent(event)

  if (connectionId) {
    return awsWebsocketWrapper(
      {
        connectionId,
        action: 'startGame',
        data: {},
      },
      websocketEndpoint,
      startGame(
        getParticipantCallback(DbProps),
        getRoomByRoomIdCallback(DbProps),
        putRoomCallback(DbProps),
      ),
    )
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
