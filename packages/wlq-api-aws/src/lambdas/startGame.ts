import startGame from '@wlq/wlq-api/src/room/startGame'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import setRoomQuestionCallback from '../callbacks/setRoomQuestionCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const websocketEventData = extractFromWebsocketEvent(event, context)
  const { connectionId } = websocketEventData

  if (connectionId) {
    return awsWebsocketWrapper(
      {
        connectionId,
        action: 'startGame',
        data: {},
      },
      websocketEventData,
      startGame(
        getParticipantCallback(DbProps),
        getRoomByRoomIdCallback(DbProps),
        setRoomQuestionCallback(DbProps),
      ),
    )
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
