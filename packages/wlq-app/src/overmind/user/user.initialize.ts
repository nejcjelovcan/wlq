import { OnInitialize } from "overmind";

export const onInitialize: OnInitialize = ({
  actions: {
    user: { loadOrRandomizeDetails }
  }
}) => {
  loadOrRandomizeDetails();
};
