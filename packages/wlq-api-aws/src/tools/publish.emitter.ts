import { IEmitter } from "@wlq/wlq-core";
import { Context } from "aws-lambda";
import SNS from "aws-sdk/clients/sns";

export type PublishEmitter = Pick<IEmitter, "publishToRoom">;

export function newPublishEmitter(sns: SNS, context: Context): PublishEmitter {
  const topic = getBroadcastTopic(context);
  console.log("TOPIC", topic);

  return {
    async publishToRoom(roomId, message) {
      await sns
        .publish({
          Subject: message.action,
          Message: JSON.stringify(message),
          TopicArn: topic,
          MessageAttributes: {
            action: { DataType: "String", StringValue: message.action },
            roomId: { DataType: "String", StringValue: roomId }
          }
        })
        .promise();
    }
  };
}

const getBroadcastTopic = (context: Context) => {
  const functionArnCols = context.invokedFunctionArn.split(":");
  const region = functionArnCols[3];
  const accountId = functionArnCols[4];

  // Relevant (but only for Lambda@Edge)
  // See: https://stackoverflow.com/questions/36428783/how-can-one-determine-the-current-region-within-an-aws-lambda-function
  // const region = context.functionName.split(":")[0];

  return `arn:aws:sns:${region}:${accountId}:${process.env.BROADCAST_TOPIC!}`;
};
