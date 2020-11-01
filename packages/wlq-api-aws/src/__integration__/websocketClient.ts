import { decodeWebsocketMessage, IWebsocketMessage } from "@wlq/wlq-core";
import WebSocket, { MessageEvent } from "ws";
import output from "./serverless-output.json";

export type WebsocketClientOptions = { log?: boolean };

export type WebsocketClient = {
  send: (message: IWebsocketMessage) => void;
  receive: (...actions: string[]) => Promise<IWebsocketMessage[]>;
  close: () => void;
  options: WebsocketClientOptions;
  queue: IWebsocketMessage[];
};

export function cleanupClient(client: WebsocketClient | undefined) {
  if (client) {
    client.close();
    if (client.options.log && client.queue.length > 0) {
      console.log("Leftover messages in websocket client queue", client.queue);
    }
  }
}

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

    const tryToResolve = (
      actions: string[],
      resolveActions: (messages: IWebsocketMessage[]) => void
    ) => {
      let unresolved = [...queue];
      const resolved: IWebsocketMessage[] = [];

      for (const action of actions) {
        const index = unresolved.findIndex(m => m.action === action);
        if (index > -1) {
          resolved.push(unresolved[index]);
          unresolved = unresolved.filter((_, i) => i !== index);
        } else {
          if (options.log)
            console.log(
              `Missing action ${action} while trying to resolve`,
              actions
            );
          return;
        }
      }

      if (options.log) console.log("Resolve successful!", actions);
      queue = unresolved;
      resolveActions(resolved);
    };

    client.onopen = () => {
      const onMessage = (event: MessageEvent) => {
        if (options.log) console.log("onMessage", event.data);
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
        get queue() {
          return queue;
        },
        get options() {
          return options;
        },
        send: message => {
          const payload = JSON.stringify(message);
          if (options.log) console.log("Send", payload);
          client.send(payload);
        },
        close: () => client.close(),
        receive: (...actions) =>
          new Promise(resolveReceive => {
            client.onmessage = event => {
              onMessage(event);
              tryToResolve(actions, resolveReceive);
            };
            tryToResolve(actions, resolveReceive);
          })
      });
    };
  });
}
