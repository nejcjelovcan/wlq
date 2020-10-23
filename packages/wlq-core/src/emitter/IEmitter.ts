import { IWlqRawPayload } from "../api/IWlqRawEvent";

export interface IWebsocketMessage<P extends IWlqRawPayload = IWlqRawPayload> {
  action: string;
  payload: P;
}

export interface IRestResponse<P extends IWlqRawPayload = IWlqRawPayload> {
  statusCode: number;
  payload: P;
}

export default interface IEmitter {
  /**
   * Websocket emitter
   *
   * Sends message to specified connectionId
   */
  websocket: <M extends IWebsocketMessage>(
    connectionId: string,
    message: M
  ) => Promise<void>;

  /**
   * Rest response emitter
   *
   * Sets a rest response to be sent as an answer to a request
   *
   * Note: Do some sanity checks when implementing this
   * (should be called only once, only for rest apis, etc...)
   */
  restResponse: <P extends IWlqRawPayload>(
    response: IRestResponse<P>
  ) => Promise<void>;

  /**
   * Publish emitter
   *
   * Publishes to notification channel
   */
  publish: <M extends IWebsocketMessage>(
    message: M,
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
