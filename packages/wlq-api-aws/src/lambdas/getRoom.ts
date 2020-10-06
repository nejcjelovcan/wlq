import getRoom from '@wlq/wlq-api/src/room/getRoom'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import getDatabaseProps from '../getDatabaseProps'
import awsRestRespond from '../wrappers/awsRestRespond'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async event =>
  awsRestRespond(() =>
    getRoom(
      { data: event.body ? JSON.parse(event.body) : {} },
      getRoomByRoomIdCallback(DbProps),
    ),
  )
