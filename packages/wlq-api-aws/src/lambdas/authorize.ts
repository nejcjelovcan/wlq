import { APIGatewayAuthorizerHandler } from 'aws-lambda'

import verifyToken from '@wlq/wlq-api/src/user/verifyToken'
import generatePolicy from '@wlq/wlq-api-aws/src/generatePolicy'

export const handler: APIGatewayAuthorizerHandler = (
  event,
  _context,
  callback,
) => {
  if (event.type !== 'TOKEN' || !event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  const tokenValue = tokenParts[1]

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized')
  }

  verifyToken(tokenValue)
    .then(sub => callback(null, generatePolicy(sub, 'Allow', event.methodArn)))
    .catch(error => {
      console.error(error)
      callback('Unauthorized')
    })
}