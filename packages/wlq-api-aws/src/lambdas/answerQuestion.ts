import answerQuestion from '@wlq/wlq-api/src/room/answerQuestion'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import putRoomCallback from '../callbacks/putRoomCallback'
import extractFromWebsocketEvent from '../extractFromWebsocketEvent'
import getDatabaseProps from '../getDatabaseProps'
import { COMMON_HEADERS } from '../wrappers/awsRestRespond'
import awsWebsocketWrapper from '../wrappers/awsWebsocketWrapper'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const websocketEventData = extractFromWebsocketEvent(event, context)
  const {
    connectionId,
    data: { answer },
  } = websocketEventData

  if (connectionId && answer) {
    return awsWebsocketWrapper(
      {
        connectionId,
        action: 'answerQuestion',
        data: { answer },
      },
      websocketEventData,
      answerQuestion(
        getParticipantCallback(DbProps),
        getRoomByRoomIdCallback(DbProps),
        putRoomCallback(DbProps),
      ),
    )
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
