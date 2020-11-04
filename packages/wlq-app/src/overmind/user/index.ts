import { OnInitialize } from "overmind";
import * as actions from "./user.actions";

const onInitialize: OnInitialize = ({
  actions: {
    user: { loadOrRandomizeDetails }
  }
}) => loadOrRandomizeDetails();

export { actions, onInitialize };
