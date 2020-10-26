import { mutate, Operator } from "overmind";
import { RouterPage } from "./router.state";

// export const route
export const test = () => {};

// export const setPage = <T>(page: "Index"|"Settings"|"New") => Operator<T> = page => mutate({})

export const setPage: <T>(page: RouterPage) => Operator<T> = page =>
  mutate(function setPage({ state }) {
    state.router.currentPage = page;
  });
