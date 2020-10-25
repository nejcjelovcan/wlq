import { IWebsocketMessage } from "@wlq/wlq-core";

// TODO this is a naive singleton
// It does not ensure that the previous socket closes if new one is initialized
const websocket = (() => {
  let socket: WebSocket | undefined;

  return {
    initialize(ws: string) {
      socket = new WebSocket(ws);
    },
    setOnMessage(onMessage: (ev: MessageEvent) => void) {
      if (socket) socket.onmessage = onMessage;
    },
    setOnOpen(onOpen: (ev: Event) => void) {
      if (socket) socket.onopen = onOpen;
    },
    setOnClose(onClose: (ev: CloseEvent) => void) {
      if (socket) socket.onclose = onClose;
    },
    setOnError(onError: (ev: Event) => void) {
      if (socket) socket.onerror = onError;
    },
    close() {
      if (socket) {
        socket.close();
        socket = undefined;
      }
    },
    send(data: string) {
      console.log("WEBSOCKET SEND", data);
      if (socket) socket.send(data);
    },
    sendMessage<P extends IWebsocketMessage>(message: P) {
      this.send(JSON.stringify(message));
    }
  };
})();
export default websocket;
