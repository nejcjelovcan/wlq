import getToken from '@wlq/wlq-api/src/user/getToken'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { respond } from '../respond'

export const handler: APIGatewayProxyHandler = async () => respond(getToken)
