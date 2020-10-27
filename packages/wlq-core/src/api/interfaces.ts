import { ValidationError } from "../model/decodeThrow";

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

export function decodeWebsocketMessage(message: any): IWebsocketMessage {
  const action =
    "action" in message && typeof message["action"] === "string"
      ? message["action"]
      : undefined;
  const data =
    "data" in message && typeof message["data"] == "object"
      ? message["data"]
      : undefined;

  if (!action || !data)
    throw new ValidationError(["Invalid IWebsocketMessage"]);
  return { action, data };
}
