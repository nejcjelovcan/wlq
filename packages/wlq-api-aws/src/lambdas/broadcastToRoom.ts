import { SNSHandler } from "aws-lambda";
import ApiGatewayManagementApi from "aws-sdk/clients/apigatewaymanagementapi";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { newRoomStore, newWebsocketEmitter } from "../tools";

const DB = new DynamoDB.DocumentClient();
const WebsocketGateway = new ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.WEBSOCKET_ENDPOINT!
});

export const handler: SNSHandler = async event => {
  const emitter = newWebsocketEmitter(WebsocketGateway);
  const store = newRoomStore(DB);

  for (const record of event.Records) {
    const attributes = record.Sns.MessageAttributes;
    const message = JSON.parse(record.Sns.Message);
    const roomId = attributes["roomId"].Value;

    console.log("BROADCASTING", roomId, message);

    const connectionIds = (await store.getParticipants({ roomId })).map(
      p => p.connectionId
    );

    console.log("CONNECTIONS", connectionIds);

    if (connectionIds.length > 0) {
      console.log("Broadcasting message", message);
      const promises = connectionIds.map(async connectionId => {
        try {
          console.log("Broadcasting to", connectionId);
          await emitter.websocket(connectionId, {
            action: message.action,
            data: message.data
          });
        } catch (e) {
          console.error("broadcastTopic Could not send to websocket");
          console.log(e);
        }
      });
      await Promise.all(promises);
    } else {
      console.log("broadcastTopic No recipients");
    }
  }
};
