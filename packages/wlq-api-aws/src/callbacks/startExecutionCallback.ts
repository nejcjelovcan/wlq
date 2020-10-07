import { StartExecutionCallback } from '@wlq/wlq-api/src/room'
import AWS from 'aws-sdk'

const startExecutionCallback: StartExecutionCallback = (
  stepFunctionArn,
  input,
) =>
  new AWS.StepFunctions()
    .startExecution({
      stateMachineArn: stepFunctionArn,
      input: JSON.stringify(input),
    })
    .promise()
export default startExecutionCallback
