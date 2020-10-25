export interface IWlqRawPayload {
  [key: string]: unknown;
}

export interface IWlqRawEvent {
  payload: IWlqRawPayload;
}

export interface IWlqRawWebsocketEvent extends IWlqRawEvent {
  connectionId: string;
}

export interface IWebsocketMessage<D extends IWlqRawPayload = IWlqRawPayload> {
  action: string;
  data: D;
}

export interface IRestResponse<P extends IWlqRawPayload = IWlqRawPayload> {
  statusCode: number;
  payload: P;
}
