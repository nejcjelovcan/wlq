export interface IWlqRawPayload {
  [key: string]: unknown;
}

export default interface IWlqRawEvent {
  payload: IWlqRawPayload;
}
