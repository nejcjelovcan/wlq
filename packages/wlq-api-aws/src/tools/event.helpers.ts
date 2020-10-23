import { IWlqRawEvent } from "@wlq/wlq-core/lib";
import { APIGatewayProxyEvent } from "aws-lambda";

export function getEventFromAws({ body }: APIGatewayProxyEvent): IWlqRawEvent {
  let payload = {};
  try {
    if (body) payload = JSON.parse(body);
  } catch (e) {
    console.error("Could not parse event.body");
    console.log(e);
  }
  return {
    payload
  };
}
