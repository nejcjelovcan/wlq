import { StartExecutionCallback } from '@wlq/wlq-api/src/room'
import StepFunctions from 'aws-sdk/clients/stepfunctions'

const startExecutionCallback: StartExecutionCallback = (
  stepFunctionArn,
  input,
) =>
  new StepFunctions()
    .startExecution({
      stateMachineArn: stepFunctionArn,
      input: JSON.stringify(input),
    })
    .promise()
export default startExecutionCallback
