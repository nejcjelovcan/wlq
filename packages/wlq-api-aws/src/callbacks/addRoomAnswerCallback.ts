import { AddRoomAnswerCallback } from '@wlq/wlq-api/src/room'
import { Room, getRoomPK } from '@wlq/wlq-model/src/room'
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
    Key: { PK: getRoomPK({ roomId }) },
    UpdateExpression: 'SET answers.#pid = :answer',
    ExpressionAttributeNames: { '#pid': pid },
    ExpressionAttributeValues: { ':answer': answer },
    ReturnValues: 'UPDATED_NEW',
  }).promise()
  return result.Attributes as Pick<Room, 'answers'>
}

export default addRoomAnswerCallback
