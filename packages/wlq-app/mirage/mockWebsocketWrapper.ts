import {
  WebsocketEvent,
  WebsocketEventHandler,
  WebsocketPayload,
} from '@wlq/wlq-api/src/websocket'
import { WebSocket } from 'mock-socket'

const mockWebsocketWrapper = async <P extends WebsocketPayload>(
  incomingEvent: WebsocketEvent<P>,
  socket: WebSocket,
  eventHandler: WebsocketEventHandler<P>,
): Promise<void> => {
  try {
    const events = await eventHandler(incomingEvent)
    for (const event of events) {
      // just send to that one socket we have (no broadcast logic)
      socket.send(JSON.stringify({ action: event.action, data: event.data }))
    }
  } catch (e) {
    console.error('mockWebsocketWrapper error')
    console.log(e)
  }
  return
}
export default mockWebsocketWrapper
