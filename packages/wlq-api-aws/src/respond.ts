import Response from '@wlq/wlq-api/src/rest/Response'
import { APIGatewayProxyResult } from 'aws-lambda'

export const respond = (response: Response): APIGatewayProxyResult => ({
  statusCode: response.statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(response.data, null, '  '),
})
