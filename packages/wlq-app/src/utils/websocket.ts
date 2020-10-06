import { WebsocketPayload } from '@wlq/wlq-api/src/websocket'

const websocket = (() => {
  let socket: WebSocket

  return {
    initialize(ws: string) {
      socket = new WebSocket(ws)
    },
    setOnMessage(onMessage: (ev: MessageEvent) => void) {
      if (socket) socket.onmessage = onMessage
    },
    setOnOpen(onOpen: (ev: Event) => void) {
      if (socket) socket.onopen = onOpen
    },
    setOnClose(onClose: (ev: CloseEvent) => void) {
      if (socket) socket.onclose = onClose
    },
    setOnError(onError: (ev: Event) => void) {
      if (socket) socket.onerror = onError
    },
    close() {
      if (socket) socket.close()
    },
    send(data: string) {
      console.log('WEBSOCKET SEND', data)
      if (socket) socket.send(data)
    },
    sendPayload<P extends WebsocketPayload>(message: P) {
      this.send(JSON.stringify(message))
    },
  }
})()
export default websocket
