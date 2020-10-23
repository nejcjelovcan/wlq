import IEmitter from "../emitter/IEmitter";
import IStore from "../model/IStore";

export default interface IWlqContext {
  store: IStore;
  emitter: IEmitter;
}
