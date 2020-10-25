import { IEmitter } from "@wlq/wlq-core";
import ApiGatewayManagementApi from "aws-sdk/clients/apigatewaymanagementapi";

export type WebsocketEmitter = Pick<IEmitter, "websocket">;

export function newWebsocketEmitter(
  gateway: ApiGatewayManagementApi
): WebsocketEmitter {
  // let _gateway: ApiGatewayManagementApi;
  // const getGateway = () => {
  //   if (!_gateway)
  //     _gateway = new ApiGatewayManagementApi({
  //       apiVersion: "2018-11-29",
  //       endpoint: process.env.WEBSOCKET_ENDPOINT!
  //     });
  //   return _gateway;
  // };

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
