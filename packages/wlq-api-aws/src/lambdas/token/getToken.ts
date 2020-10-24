import getToken from "@wlq/wlq-core/lib/api/token/getToken.rest";
import { APIGatewayProxyResult } from "aws-lambda";
import { newResponseEmitter, responseEmitterToAwsResult } from "../../tools";

export async function handler(): Promise<APIGatewayProxyResult> {
  const emitter = newResponseEmitter();
  await getToken(emitter);
  return responseEmitterToAwsResult(emitter);
}
