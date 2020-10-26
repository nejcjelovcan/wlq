import { OnInitialize } from "overmind";

const onInitialize: OnInitialize = ({
  actions: {
    router: { goToIndex, goToNew, goToRoom, goToSettings }
  },
  effects
}) => {
  effects.router.initialize({
    "/": goToIndex,
    "/room": goToNew,
    "/room/:roomId": goToRoom,
    "/settings": goToSettings
  });
};

export default onInitialize;
