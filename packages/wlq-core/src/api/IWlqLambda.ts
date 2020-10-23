import IWlqContext from "./IWlqContext";
import IWlqRawEvent from "./IWlqRawEvent";

export default interface IWlqLambda {
  (event: IWlqRawEvent, context: IWlqContext): Promise<void>;
}
