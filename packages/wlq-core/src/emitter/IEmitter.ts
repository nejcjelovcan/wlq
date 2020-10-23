import IWlqRawEvent, { IWlqRawPayload } from "../api/IWlqRawEvent";

export interface IWebsocketMessage extends IWlqRawEvent {
  action: string;
}

export interface IRestResponse extends IWlqRawEvent {
  statusCode: number;
}

export default interface IEmitter {
  /**
   * Websocket emitter
   *
   * Sends message to specified connectionId
   */
  websocket: (
    connectionId: string,
    message: IWebsocketMessage
  ) => Promise<void>;

  /**
   * Rest response emitter
   *
   * Sets a rest response to be sent as an answer to a request
   *
   * Note: Do some sanity checks when implementing this
   * (should be called only once, only for rest apis, etc...)
   */
  restResponse: (response: IRestResponse) => Promise<void>;

  /**
   * Publish emitter
   *
   * Publishes to notification channel
   */
  publish: (
    subject: string,
    message: IWlqRawPayload,
    attributes: { [key: string]: string }
  ) => Promise<void>;

  /**
   * State machine start emitter
   *
   * Starts state machine execution such as AWS Step functions
   */
  stateMachineStart: (
    stepFunctionArn: string,
    input: IWlqRawPayload
  ) => Promise<void>;

  /**
   * State machine task success emitter
   *
   * Send a success to a state machine task
   */
  stateMachineTaskSuccess: (
    taskToken: string,
    output: IWlqRawPayload
  ) => Promise<void>;
}
