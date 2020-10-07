import answerQuestion from '@wlq/wlq-api/src/room/answerQuestion'
import { APIGatewayProxyHandler } from 'aws-lambda'
import addRoomAnswerCallback from '../callbacks/addRoomAnswerCallback'
import getParticipantCallback from '../callbacks/getParticipantCallback'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import getRoomParticipantsCallback from '../callbacks/getRoomParticipantsCallback'
import sendTaskSuccessCallback from '../callbacks/sendTaskSuccessCallback'
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
        addRoomAnswerCallback(DbProps),
        getRoomParticipantsCallback(DbProps),
        sendTaskSuccessCallback,
      ),
    )
  }
  return { statusCode: 400, headers: COMMON_HEADERS, body: '{}' }
}
