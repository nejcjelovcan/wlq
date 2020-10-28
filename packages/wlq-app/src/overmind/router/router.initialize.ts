import { OnInitialize } from "overmind";

const onInitialize: OnInitialize = ({
  actions: {
    router: { setPageIndex, setPageNew, setPageRoom, setPageSettings }
  },
  effects
}) => {
  effects.router.initialize({
    "/": setPageIndex,
    "/room": setPageNew,
    "/room/:roomId": setPageRoom,
    "/settings": setPageSettings
  });
};

export default onInitialize;
