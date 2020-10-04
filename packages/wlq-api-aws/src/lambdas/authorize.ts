import verifyToken from '@wlq/wlq-api/src/user/verifyToken.helper'
import { APIGatewayAuthorizerHandler } from 'aws-lambda'
import generatePolicy from '../generatePolicy'

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
    console.log('No auth token!')
    return callback('Unauthorized')
  }

  verifyToken(tokenValue)
    .then(sub => {
      console.log(
        'Token verified!',
        JSON.stringify(generatePolicy(sub, 'Allow', event.methodArn)),
      )
      callback(null, generatePolicy(sub, 'Allow', event.methodArn))
    })
    .catch(error => {
      console.error('Token verification error')
      console.error(error)
      callback('Unauthorized')
    })
}
