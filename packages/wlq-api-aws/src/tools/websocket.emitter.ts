import { IEmitter } from "@wlq/wlq-core";
import ApiGatewayManagementApi from "aws-sdk/clients/apigatewaymanagementapi";

export type WebsocketEmitter = Pick<IEmitter, "websocket">;

export function newWebsocketEmitter(
  gateway: ApiGatewayManagementApi
): WebsocketEmitter {
  return {
    async websocket(connectionId, message) {
      await gateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(message)
        })
        .promise();
    }
  };
}
