import { IEmitter } from "@wlq/wlq-core";
import { Context } from "aws-lambda";
import SNS from "aws-sdk/clients/sns";

export type PublishEmitter = Pick<IEmitter, "publish">;

export function newPublishEmitter(sns: SNS, context: Context): PublishEmitter {
  const topic = getBroadcastTopic(context);

  return {
    async publish(message) {
      await sns
        .publish({
          Subject: message.action,
          Message: JSON.stringify(message),
          TopicArn: topic,
          MessageAttributes: {
            action: { DataType: "String", StringValue: message.action }
          }
        })
        .promise();
    }
  };
}

const getBroadcastTopic = (context: Context) => {
  const functionArnCols = context.invokedFunctionArn.split(":");
  const accountId = functionArnCols[4];

  // not getting region from invokedFunctionArn (or AWS_REGION)
  // because it can be wrong in Lambda@Edge context
  // See: https://stackoverflow.com/questions/36428783/how-can-one-determine-the-current-region-within-an-aws-lambda-function
  const region = context.functionName.split(":")[0];
  return `arn:aws:sns:${region}:${accountId}:${process.env.BROADCAST_TOPIC!}`;
};
