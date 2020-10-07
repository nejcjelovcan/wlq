import setRoomQuestionTokenCallback from '@wlq/wlq-api-aws/src/callbacks/setRoomQuestionTokenCallback'
import getDatabaseProps from '@wlq/wlq-api-aws/src/getDatabaseProps'

const DbProps = getDatabaseProps()

export const handler = async (event: { [key: string]: unknown }) => {
  console.log('Issue question token', event)
  if (typeof event.roomId === 'string' && event.questionToken === 'string') {
    await setRoomQuestionTokenCallback(DbProps)(
      event.roomId,
      event.questionToken,
    )
  }
  return { channel: event.roomId }
}
