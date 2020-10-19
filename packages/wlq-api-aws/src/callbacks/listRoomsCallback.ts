import { ListRoomsCallback } from '@wlq/wlq-api/src/room'
import { Room } from '@wlq/wlq-model/src/room'
import { DatabaseProps } from '../DatabaseProps'

const listRoomsCallback = ({
  DB,
  TableName,
}: DatabaseProps): ListRoomsCallback => async () => {
  const result = await DB.scan({
    TableName,
    FilterExpression:
      'listed = :listed and participantCount >= :min and participantCount <= :max',
    ExpressionAttributeValues: {
      ':listed': true,
      ':min': 1,
      ':max': 7,
    },
  }).promise()

  if (Array.isArray(result.Items)) {
    return result.Items as Room[]
  }

  return []
}
export default listRoomsCallback
