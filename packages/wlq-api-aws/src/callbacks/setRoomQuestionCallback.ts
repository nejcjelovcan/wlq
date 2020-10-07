import { SetRoomQuestionCallback } from '@wlq/wlq-api/src/room'
import { PosedQuestion } from '@wlq/wlq-model/src/collection'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const setRoomQuestionCallback = ({
  DB,
  TableName,
}: DatabaseProps): SetRoomQuestionCallback => async (
  roomId: string,
  question: PosedQuestion,
) =>
  DB.update({
    TableName,
    Key: getRoomKeys({ roomId }),
    UpdateExpression:
      'SET question = :question, answers = :answers, #state = :state, atQuestionNumber = atQuestionNumber + :inc',
    ExpressionAttributeNames: { '#state': 'state' },
    ExpressionAttributeValues: {
      ':question': question,
      ':answers': {},
      ':state': 'Question',
      ':inc': 1,
    },
  }).promise()

export default setRoomQuestionCallback
