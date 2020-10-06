import getToken from '@wlq/wlq-api/src/user/getToken'
import { APIGatewayProxyHandler } from 'aws-lambda'
import awsRestRespond from '../wrappers/awsRestRespond'

export const handler: APIGatewayProxyHandler = async () =>
  awsRestRespond(getToken)
