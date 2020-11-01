import { decodeWebsocketMessage, IWebsocketMessage } from "@wlq/wlq-core";
import WebSocket, { MessageEvent } from "ws";
import output from "./serverless-output.json";

export type WebsocketClient = {
  send: (message: IWebsocketMessage) => void;
  receive: (...actions: string[]) => Promise<IWebsocketMessage[]>;
  close: () => void;
  queue: IWebsocketMessage[];
};

// eslint-disable-next-line require-await
export default async function websocketClient(
  options: { log?: boolean } = {}
): Promise<WebsocketClient> {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(output.ServiceEndpointWebsocket);
    let queue: IWebsocketMessage[] = [];

    client.onerror = event => {
      console.error(event);
      reject(event);
    };

    const tryToResolve = (actions: string[]) => {
      let unresolved = [...queue];
      const resolved: IWebsocketMessage[] = [];

      for (const action of actions) {
        const index = unresolved.findIndex(m => m.action === action);
        if (index > -1) {
          resolved.push(unresolved[index]);
          unresolved = unresolved.filter((_, i) => i !== index);
        } else {
          return undefined;
        }
      }

      queue = unresolved;
      return resolved;
    };

    client.onopen = () => {
      const onMessage = (event: MessageEvent) => {
        if (options.log) console.log(event.data);
        try {
          queue.push(decodeWebsocketMessage(JSON.parse(event.data.toString())));
        } catch (error) {
          console.error(error);
          console.log(event.data);
          throw error;
        }
      };

      client.onmessage = onMessage;

      resolve({
        send: message => client.send(JSON.stringify(message)),
        close: () => client.close(),
        get queue() {
          return queue;
        },
        receive: (...actions) =>
          new Promise(resolveReceive => {
            client.onmessage = event => {
              onMessage(event);
              const resolved = tryToResolve(actions);
              if (resolved) {
                resolveReceive(resolved);
              }
            };
          })
      });
    };
  });
}
