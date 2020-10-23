export default interface IWlqRawEvent {
  payload: IWlqRawPayload;
}

export interface IWlqRawPayload {
  [key: string]: unknown;
}

export interface IWlqRawWebsocketEvent extends IWlqRawEvent {
  connectionId: string;
}
