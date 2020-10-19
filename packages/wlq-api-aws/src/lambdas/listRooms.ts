import listRoomsCallback from '@wlq/wlq-api-aws/src/callbacks/listRoomsCallback'
import listRooms from '@wlq/wlq-api/src/room/listRooms'
import { APIGatewayProxyHandler } from 'aws-lambda'
import getDatabaseProps from '../getDatabaseProps'
import awsRestRespond from '../wrappers/awsRestRespond'

const DbProps = getDatabaseProps()

export const handler: APIGatewayProxyHandler = async _ =>
  awsRestRespond(() => listRooms(listRoomsCallback(DbProps)))
