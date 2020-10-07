import { SetRoomQuestionTokenCallback } from '@wlq/wlq-api/src/room'
import { getRoomKeys } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const setRoomQuestionTokenCallback = ({
  DB,
  TableName,
}: DatabaseProps): SetRoomQuestionTokenCallback => async (
  roomId: string,
  questionToken: string,
) =>
  DB.update({
    TableName,
    Key: getRoomKeys({ roomId }),
    UpdateExpression: 'SET #questionToken = :questionToken',
    ExpressionAttributeNames: {
      '#questionToken': '_questionToken',
    },
    ExpressionAttributeValues: {
      ':questionToken': questionToken,
    },
  }).promise()

export default setRoomQuestionTokenCallback
