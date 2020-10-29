import { Operator, run } from "overmind";

export const redirectToIndex: <T>() => Operator<T> = () =>
  run(function redirectToIndex({
    actions: {
      router: { open }
    }
  }) {
    open({ path: "/" });
  });
