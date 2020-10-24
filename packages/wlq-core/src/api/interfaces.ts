export interface IWlqRawPayload {
  [key: string]: unknown;
}

export interface IWlqRawEvent {
  payload: IWlqRawPayload;
}

export interface IWlqRawWebsocketEvent extends IWlqRawEvent {
  connectionId: string;
}

export interface IWebsocketMessage<P extends IWlqRawPayload = IWlqRawPayload> {
  action: string;
  payload: P;
}

export interface IRestResponse<P extends IWlqRawPayload = IWlqRawPayload> {
  statusCode: number;
  payload: P;
}
