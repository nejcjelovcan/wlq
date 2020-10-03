import { WsMessage } from '@wlq/wlq-api/src/ws'

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
    sendMessage<D extends object>(message: WsMessage<D>) {
      this.send(JSON.stringify(message))
    },
  }
})()
export default websocket
