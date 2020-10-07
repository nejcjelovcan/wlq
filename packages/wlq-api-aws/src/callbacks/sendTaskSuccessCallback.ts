import { SendTaskSuccessCallback } from '@wlq/wlq-api/src/room'
import StepFunctions from 'aws-sdk/clients/stepfunctions'

const sendTaskSuccessCallback: SendTaskSuccessCallback = (taskToken, output) =>
  new StepFunctions()
    .sendTaskSuccess({
      taskToken,
      output: JSON.stringify(output),
    })
    .promise()
export default sendTaskSuccessCallback
