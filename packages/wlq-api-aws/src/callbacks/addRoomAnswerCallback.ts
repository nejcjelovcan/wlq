import { AddRoomAnswerCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const addRoomAnswerCallback = ({
  DB,
  TableName,
}: DatabaseProps): AddRoomAnswerCallback => async (
  roomId: string,
  pid: string,
  answer: string,
) => {
  const result = await DB.update({
    TableName,
    Key: getRoomKeys({ roomId }),
    UpdateExpression: 'SET answers.#pid = :answer',
    ExpressionAttributeNames: { '#pid': pid },
    ExpressionAttributeValues: { ':answer': answer },
    ReturnValues: 'ALL_NEW',
  }).promise()
  return { answers: result.Attributes?.answers ?? {} }
}

export default addRoomAnswerCallback
