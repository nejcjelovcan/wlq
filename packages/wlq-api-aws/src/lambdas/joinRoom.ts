import joinRoom from '@wlq/wlq-api/src/room/joinRoom'
import verifyToken from '@wlq/wlq-api/src/user/helpers/verifyToken.helper'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import getRoomParticipantsCallback from '../callbacks/getRoomParticipantsCallback'
import putParticipantCallback from '../callbacks/putParticipantCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const websocketEventData = extractFromWebsocketEvent(event, context)
  const {
    connectionId,
    data: { token, roomId, userDetails },
  } = websocketEventData

  if (connectionId && token && roomId && userDetails) {
    return await awsWebsocketWrapper(
      {
        connectionId,
        action: 'joinRoom',
        data: { token, roomId, userDetails },
      },
      websocketEventData,
      joinRoom(
        getRoomByRoomIdCallback(DbProps),
        verifyToken,
        putParticipantCallback(DbProps),
        getRoomParticipantsCallback(DbProps),
      ),
    )
  } else {
    console.error('joinRoom Bad Request')
    console.log(event.body)
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
