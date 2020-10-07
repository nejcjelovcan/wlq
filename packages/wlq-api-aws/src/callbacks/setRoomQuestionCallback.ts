import { SetRoomQuestionCallback } from '@wlq/wlq-api/src/room'
import { PosedQuestion } from '@wlq/wlq-model/src/collection'
import { getRoomPK } from '@wlq/wlq-model/src/room'
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
    Key: { PK: getRoomPK({ roomId }) },
    UpdateExpression:
      'SET question = :question, answers = :answers, #state = :state',
    ExpressionAttributeNames: { '#state': 'state' },
    ExpressionAttributeValues: {
      ':question': question,
      ':answers': {},
      ':state': 'Question',
    },
  }).promise()

export default setRoomQuestionCallback
