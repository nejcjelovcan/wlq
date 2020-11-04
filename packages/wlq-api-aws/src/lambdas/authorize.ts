import { verifyToken } from "@wlq/wlq-core/lib/model/token";
import {
  APIGatewayAuthorizerHandler,
  APIGatewayAuthorizerResult
} from "aws-lambda";

export const handler: APIGatewayAuthorizerHandler = (
  event,
  _context,
  callback
) => {
  if (event.type !== "TOKEN" || !event.authorizationToken) {
    return callback("Unauthorized");
  }

  const tokenParts = event.authorizationToken.split(" ");
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === "bearer" && tokenValue)) {
    return callback("Unauthorized");
  }

  verifyToken(tokenValue)
    .then(sub => callback(null, generatePolicy(sub, "Allow", event.methodArn)))
    .catch(error => {
      console.error("Token verification error");
      console.error(error);
      callback("Unauthorized");
    });
};

function generatePolicy(
  principalId: string | undefined,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult | undefined {
  if (effect && resource && principalId) {
    return {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: resource
          }
        ]
      }
    };
  }
  return undefined;
}
