import { APIGatewayProxyHandler } from 'aws-lambda'
import { respond } from '../respond'
import createRoom from '@wlq/wlq-api/src/room/createRoom'
import { getRoomKeys } from '@wlq/wlq-model/src/room/Room'
import AWS from 'aws-sdk'

const TableName = process.env.GAME_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event =>
  respond(() =>
    createRoom({ data: event.body ? JSON.parse(event.body) : {} }, room =>
      DB.put({
        TableName,
        Item: { ...room, ...getRoomKeys(room) },
        ConditionExpression: 'attribute_not_exists(PK)',
      }).promise(),
    ),
  )
