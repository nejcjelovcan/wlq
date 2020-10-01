import { APIGatewayProxyHandler } from 'aws-lambda'
import { respond } from '../respond'

export const handler: APIGatewayProxyHandler = async () => {
  return respond({
    statusCode: 200,
    data: { room: 'This is not a room (yet)!' },
  })
}
