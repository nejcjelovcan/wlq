import roomNextQuestion from '@wlq/wlq-api/src/room/roomNextQuestion'
import getRoomByRoomIdCallback from '../callbacks/getRoomByRoomIdCallback'
import setRoomFinishedCallback from '../callbacks/setRoomFinishedCallback'
import setRoomQuestionCallback from '../callbacks/setRoomQuestionCallback'
import startExecutionCallback from '../callbacks/startExecutionCallback'
import getDatabaseProps from '../getDatabaseProps'

const DbProps = getDatabaseProps()

export const handler = async (event: { [key: string]: unknown }) => {
  console.log('Room next question', event)
  if (typeof event.roomId === 'string') {
    await roomNextQuestion(
      getRoomByRoomIdCallback(DbProps),
      setRoomQuestionCallback(DbProps),
      startExecutionCallback,
      setRoomFinishedCallback(DbProps),
    )(event.roomId)
  }
  return { channel: event.roomId }
}
