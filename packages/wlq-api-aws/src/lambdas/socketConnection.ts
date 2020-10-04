import leaveRoom from '@wlq/wlq-api/src/room/leaveRoom'
import { newWsMessageEvent, wsEventConsumer } from '@wlq/wlq-api/src/ws'
import { getRoomParticipantKeys } from '@wlq/wlq-model/src/room'
import { APIGatewayProxyHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import awsWebsocketSendFunction from '../awsWebsocketSendFunction'
import getRoomAndParticipantsByRoomId from '../getRoomAndParticipantsByRoomId'
import getRoomParticipantByConnectionId from '../getRoomParticipantByConnectionId'
import getWebsocketApi from '../getWebsocketApi'
import { COMMON_HEADERS } from '../respond'

const TableName = process.env.ROOM_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

// TODO We should disconnect clients that haven't joinRoom in a short time
export const handler: APIGatewayProxyHandler = async ({
  requestContext: { connectionId, routeKey, domainName, stage },
}) => {
  const websocketApi = getWebsocketApi(domainName, stage)

  switch (routeKey) {
    case '$connect':
      console.log('CONNECT')
      break
    case '$disconnect':
      console.log('DISCONNECT')
      const incomingEvent = newWsMessageEvent(connectionId!, 'leaveRoom', {})
      await wsEventConsumer(
        incomingEvent,
        leaveRoom(
          async cid => getRoomParticipantByConnectionId(DB, TableName, cid),
          async participant =>
            DB.delete({
              TableName,
              Key: getRoomParticipantKeys(participant),
            }).promise(),
          async roomId => getRoomAndParticipantsByRoomId(DB, TableName, roomId),
        ),
        awsWebsocketSendFunction(websocketApi),
      )
      break
  }

  return { statusCode: 200, headers: COMMON_HEADERS, body: '{}' }
}
