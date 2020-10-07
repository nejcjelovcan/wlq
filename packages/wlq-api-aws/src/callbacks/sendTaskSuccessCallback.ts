import { SendTaskSuccessCallback } from '@wlq/wlq-api/src/room'
import AWS from 'aws-sdk'

const sendTaskSuccessCallback: SendTaskSuccessCallback = (taskToken, output) =>
  new AWS.StepFunctions()
    .sendTaskSuccess({
      taskToken,
      output: JSON.stringify(output),
    })
    .promise()
export default sendTaskSuccessCallback
