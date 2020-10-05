import {
  joinRoom,
  newWsMessageEvent,
  RoomJoinProps,
  wsEventConsumer,
} from '@wlq/wlq-api/src'
import verifyToken from '@wlq/wlq-api/src/user/helpers/verifyToken.helper'
import { getRoomParticipantKeys } from '@wlq/wlq-model/src/room'
import { APIGatewayProxyHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import awsWebsocketSendFunction from '../awsWebsocketSendFunction'
import getRoomAndParticipantsByRoomId from '../getRoomAndParticipantsByRoomId'
import getRoomByRoomId from '../getRoomByRoomId'
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
      data: { token, roomId, userDetails },
    } = JSON.parse(body)

    if (token && roomId && userDetails) {
      const incomingEvent = newWsMessageEvent<RoomJoinProps>(
        connectionId,
        'joinRoom',
        {
          token,
          roomId,
          userDetails,
        },
      )

      await wsEventConsumer(
        incomingEvent,
        joinRoom(
          verifyToken,
          async roomId => getRoomByRoomId(DB, TableName, roomId),
          async roomId => getRoomAndParticipantsByRoomId(DB, TableName, roomId),
          async participant =>
            DB.put({
              TableName,
              Item: { ...participant, ...getRoomParticipantKeys(participant) },
              ConditionExpression: 'attribute_not_exists(PK)',
            }).promise(),
        ),
        // todo it can happen that ConnectionId is gone (GoneException: 410)
        awsWebsocketSendFunction(websocketApi),
      )
    }
  }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
