export interface WebsocketPayload<
  A extends string = string,
  D extends object = object
> {
  action: A
  data: D
}

export type WebsocketEvent<
  P extends WebsocketPayload = WebsocketPayload
> = P & {
  connectionId: string
}

export type WebsocketBroadcast<
  P extends WebsocketPayload = WebsocketPayload
> = P & {
  channel: string
}

export type WebsocketEventHandlerReturn = Promise<
  (WebsocketEvent | WebsocketBroadcast)[]
>

export type WebsocketEventHandler<
  P extends WebsocketPayload = WebsocketPayload
> = (incomingEvent: WebsocketEvent<P>) => WebsocketEventHandlerReturn
