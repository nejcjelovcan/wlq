import { RoomParticipant } from '@wlq/wlq-model/src/room'
import AWS from 'aws-sdk'

const getRoomParticipantByConnectionId = async (
  DB: AWS.DynamoDB.DocumentClient,
  TableName: string,
  connectionId: string,
): Promise<RoomParticipant | undefined> => {
  try {
    const result = await DB.query({
      TableName,
      IndexName: 'InverseIndex',
      KeyConditionExpression: 'SK = :sk',
      ExpressionAttributeValues: {
        ':sk': `#ROOM_PARTICIPANT#${connectionId}`,
      },
      ScanIndexForward: true,
    }).promise()
    if (Array.isArray(result.Items) && result.Items.length === 1) {
      return (result.Items[0] as unknown) as RoomParticipant
    }
  } catch (e) {
    console.error('Error in getRoomParticipantByConnectionId', e)
  }
  return undefined
}
export default getRoomParticipantByConnectionId
