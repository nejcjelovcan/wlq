import { OnInitialize } from "overmind";

export const onInitialize: OnInitialize = ({
  actions: {
    token: { assureToken }
  }
}) => {
  assureToken();
};
