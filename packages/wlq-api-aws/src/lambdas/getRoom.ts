import { getRoom } from '@wlq/wlq-api/src/room'
import { APIGatewayProxyHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import getRoomByRoomId from '../getRoomByRoomId'
import { respond } from '../respond'

const TableName = process.env.ROOM_TABLE_NAME!
const DB = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async event =>
  respond(() =>
    getRoom({ data: event.body ? JSON.parse(event.body) : {} }, roomId =>
      getRoomByRoomId(DB, TableName, roomId),
    ),
  )
