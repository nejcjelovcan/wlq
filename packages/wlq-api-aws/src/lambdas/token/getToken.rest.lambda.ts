import getToken from "@wlq/wlq-core/lib/cjs/api/token/getToken.rest";
import { APIGatewayProxyResult } from "aws-lambda";
import {
  newResponseEmitter,
  responseEmitterToAwsResult
} from "../../tools/response.emitter";

export default async function handler(): Promise<APIGatewayProxyResult> {
  const emitter = newResponseEmitter();
  await getToken(emitter);
  return responseEmitterToAwsResult(emitter);
}
