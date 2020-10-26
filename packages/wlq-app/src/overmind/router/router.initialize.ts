import { OnInitialize } from "overmind";

const onInitialize: OnInitialize = ({
  actions: {
    router: { goToIndex, goToSettings }
  },
  effects
}) => {
  effects.router.initialize({
    "/": goToIndex,
    "/settings": goToSettings
  });
};

export default onInitialize;
