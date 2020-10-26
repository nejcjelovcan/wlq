import { OnInitialize } from "overmind";

const onInitialize: OnInitialize = ({ actions, effects }) => {
  effects.router.initialize({
    "/": actions.router.showIndexPage
  });
};

export default onInitialize;
