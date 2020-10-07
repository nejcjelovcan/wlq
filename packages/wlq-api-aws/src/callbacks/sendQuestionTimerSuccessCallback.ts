import { SendQuestionTimerSuccessCallback } from '@wlq/wlq-api/src/room'
import AWS from 'aws-sdk'

const sendQuestionTimerSuccessCallback: SendQuestionTimerSuccessCallback = (
  questionToken: string,
) =>
  new AWS.StepFunctions()
    .sendTaskSuccess({
      taskToken: questionToken,
      output: 'test',
    })
    .promise()
export default sendQuestionTimerSuccessCallback
