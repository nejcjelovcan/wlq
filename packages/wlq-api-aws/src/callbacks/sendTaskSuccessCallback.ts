import { SendTaskSuccessCallback } from '@wlq/wlq-api/src/room'
import AWS from 'aws-sdk'

const sendTaskSuccessCallback: SendTaskSuccessCallback = (
  taskToken: string,
  output,
) =>
  new AWS.StepFunctions()
    .sendTaskSuccess({
      taskToken,
      output,
    })
    .promise()
export default sendTaskSuccessCallback
