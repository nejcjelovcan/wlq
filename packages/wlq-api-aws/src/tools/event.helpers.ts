import { IWlqRawEvent, IWlqRawWebsocketEvent } from "@wlq/wlq-core/lib";
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

export function getWebsocketEventFromAws(
  event: APIGatewayProxyEvent
): IWlqRawWebsocketEvent {
  let { payload } = getEventFromAws(event);
  const {
    requestContext: { connectionId }
  } = event;

  return {
    connectionId: connectionId!,
    payload
  };
}
