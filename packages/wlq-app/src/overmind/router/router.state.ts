export type RouterPage =
  | {
      name: "index";
    }
  | { name: "settings" }
  | { name: "new" }
  | { name: "room"; roomId: string };

export type RouterState = { currentPage: RouterPage };

export const state: RouterState = {
  currentPage: { name: "index" }
};
