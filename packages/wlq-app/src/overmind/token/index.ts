import { OnInitialize } from "overmind";
import * as actions from "./token.actions";

const onInitialize: OnInitialize = ({
  actions: {
    token: { assureToken }
  }
}) => assureToken();
export { actions, onInitialize };
