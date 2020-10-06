import { COMMON_HEADERS } from '../wrappers/awsRestRespond'
import joinRoom from '@wlq/wlq-api/src/room/joinRoom'
import verifyToken from '@wlq/wlq-api/src/user/helpers/verifyToken.helper'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import getRoomParticipantsCallback from '../callbacks/getRoomParticipantsCallback'
import putParticipantCallback from '../callbacks/putParticipantCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async event => {
  const {
    connectionId,
    websocketEndpoint,
    data: { token, roomId, userDetails },
  } = extractFromWebsocketEvent(event)

  if (connectionId && token && roomId && userDetails) {
    return awsWebsocketWrapper(
      {
        connectionId,
        action: 'joinRoom',
        data: { token, roomId, userDetails },
      },
      websocketEndpoint,
      joinRoom(
        getRoomByRoomIdCallback(DbProps),
        verifyToken,
        putParticipantCallback(DbProps),
        getRoomParticipantsCallback(DbProps),
      ),
    )
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
