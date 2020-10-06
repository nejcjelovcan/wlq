import createRoom from '@wlq/wlq-api/src/room/createRoom'
import { APIGatewayProxyHandler } from 'aws-lambda'
import putRoomCallback from '../callbacks/putRoomCallback'
import getDatabaseProps from '../getDatabaseProps'
import awsRestRespond from '../wrappers/awsRestRespond'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async event =>
  awsRestRespond(() =>
    createRoom(
      { data: event.body ? JSON.parse(event.body) : {} },
      putRoomCallback(DbProps),
    ),
  )
