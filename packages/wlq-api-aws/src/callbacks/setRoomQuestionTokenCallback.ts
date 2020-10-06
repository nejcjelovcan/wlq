import { SetRoomQuestionTokenCallback } from '@wlq/wlq-api/src/room'
import { getRoomPK } from '@wlq/wlq-model/src/room'
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
    Key: { PK: getRoomPK({ roomId }) },
    UpdateExpression: 'SET _questionToken = :questionToken',

    ExpressionAttributeValues: {
      ':questionToken': questionToken,
    },
  }).promise()

export default setRoomQuestionTokenCallback