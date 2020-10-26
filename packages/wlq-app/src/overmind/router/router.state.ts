export type RouterPage =
  | {
      name: "Index";
    }
  | { name: "Settings" }
  | { name: "New" }
  | { name: "Room"; roomId: string };

export type RouterState = { currentPage: RouterPage };

export const state: RouterState = {
  currentPage: { name: "Index" }
};
