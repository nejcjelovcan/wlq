import { APIGatewayAuthorizerResult } from 'aws-lambda'

const generatePolicy = (
  principalId: string | undefined,
  effect: string,
  resource: string,
): APIGatewayAuthorizerResult | undefined => {
  if (effect && resource && principalId) {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
    }
  }
  return undefined
}
export default generatePolicy
