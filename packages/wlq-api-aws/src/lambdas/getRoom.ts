import { APIGatewayProxyHandler } from 'aws-lambda'
import { respond } from '../respond'
import AWS from 'aws-sdk'
import getRoom from '@wlq/wlq-api/src/room/getRoom'
import getRoomByRoomId from '@wlq/wlq-api-aws/src/getRoomByRoomId'

const TableName = process.env.ROOM_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event =>
  respond(() =>
    getRoom({ data: event.body ? JSON.parse(event.body) : {} }, roomId =>
      getRoomByRoomId(DB, TableName, roomId),
    ),
  )
