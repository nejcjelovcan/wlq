import { getBroadcastTopic } from '@wlq/wlq-api-aws/src/extractFromWebsocketEvent'
import awsWebsocketWrapper from '@wlq/wlq-api-aws/src/wrappers/awsWebsocketWrapper'
import roomNextQuestion from '@wlq/wlq-api/src/room/roomNextQuestion'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import setRoomFinishedCallback from '../callbacks/setRoomFinishedCallback'
import setRoomQuestionCallback from '../callbacks/setRoomQuestionCallback'
import startExecutionCallback from '../callbacks/startExecutionCallback'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

export const handler = async (event: { [key: string]: unknown }, context) => {
  console.log('Room next question', event)
  if (typeof event.roomId === 'string') {
    await awsWebsocketWrapper(
      event.roomId,
      { BroadcastTopicArn: getBroadcastTopic(context) },
      roomNextQuestion(
        getRoomByRoomIdCallback(DbProps),
        setRoomQuestionCallback(DbProps),
        startExecutionCallback,
        setRoomFinishedCallback(DbProps),
      ),
    )
  }
  return { channel: event.roomId }
}
