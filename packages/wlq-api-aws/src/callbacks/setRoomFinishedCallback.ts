import { SetRoomFinishedCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const setRoomFinishedCallback = ({
  DB,
  TableName,
}: DatabaseProps): SetRoomFinishedCallback => async (roomId: string) =>
  DB.update({
    TableName,
    Key: getRoomKeys({ roomId }),
    UpdateExpression:
      'SET question = :question, answers = :answers, #state = :state, atQuestionNumber = :at',
    ExpressionAttributeNames: { '#state': 'state' },
    ExpressionAttributeValues: {
      ':question': {},
      ':answers': {},
      ':state': 'Finished',
      ':at': 0,
    },
  }).promise()

export default setRoomFinishedCallback
