import getRoomParticipantByConnectionId from '@wlq/wlq-api-aws/src/getRoomParticipantByConnectionId'
import {
  newWsMessageEvent,
  RoomAnswerQuestionProps,
  wsEventConsumer,
} from '@wlq/wlq-api/src'
import answerQuestion from '@wlq/wlq-api/src/room/answerQuestion'
import { APIGatewayProxyHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import awsWebsocketSendFunction from '../awsWebsocketSendFunction'
import getRoomAndParticipantsByRoomId from '../getRoomAndParticipantsByRoomId'
import getWebsocketApi from '../getWebsocketApi'
import { COMMON_HEADERS } from '../respond'

const TableName = process.env.ROOM_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async ({
  requestContext: { domainName, stage, connectionId },
  body,
}) => {
  if (connectionId && body) {
    const websocketApi = getWebsocketApi(domainName, stage)

    const {
      data: { answer },
    } = JSON.parse(body)

    const incomingEvent = newWsMessageEvent<RoomAnswerQuestionProps>(
      connectionId,
      'answerQuestion',
      { answer },
    )

    await wsEventConsumer(
      incomingEvent,
      answerQuestion(
        async connectionId =>
          getRoomParticipantByConnectionId(DB, TableName, connectionId),
        async roomId => getRoomAndParticipantsByRoomId(DB, TableName, roomId),
        async (room, update) => {
          const item = { ...room, ...update }
          await DB.put({
            TableName,
            Item: item,
          }).promise()
          return item
        },
      ),
      awsWebsocketSendFunction(websocketApi),
    )
  }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
