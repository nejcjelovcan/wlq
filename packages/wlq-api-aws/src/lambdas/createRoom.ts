import { createRoom } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { APIGatewayProxyHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import { respond } from '../respond'

const TableName = process.env.ROOM_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event =>
  respond(() =>
    createRoom({ data: event.body ? JSON.parse(event.body) : {} }, room =>
      DB.put({
        TableName,
        Item: {
          ...room,
          ...getRoomKeys(room),
          ws: process.env.WEBSOCKET_ENDPOINT,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      }).promise(),
    ),
  )
