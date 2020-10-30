import { IEmitter } from "@wlq/wlq-core";
import StepFunctions from "aws-sdk/clients/stepfunctions";

export type StateMachineEmitter = Pick<
  IEmitter,
  "stateMachineStart" | "stateMachineTaskSuccess"
>;

const stepFunctions = new StepFunctions();

export function newStateMachineEmitter(): StateMachineEmitter {
  return {
    async stateMachineStart(stepFunctionArn, input) {
      await stepFunctions
        .startExecution({
          stateMachineArn: stepFunctionArn,
          input: JSON.stringify(input)
        })
        .promise();
    },
    async stateMachineTaskSuccess(taskToken, output) {
      await stepFunctions
        .sendTaskSuccess({ taskToken, output: JSON.stringify(output) })
        .promise();
    }
  };
}
