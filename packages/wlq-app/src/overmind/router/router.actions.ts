import { Action, Operator } from "overmind";
import * as o from "./router.operators";

export const goToIndex: Operator = o.setPage({ name: "Index" });
export const goToSettings: Operator = o.setPage({ name: "Settings" });
export const goToNew: Operator = o.setPage({ name: "New" });

export const goToRoom: Action<{ roomId: string }> = (
  { state: { router } },
  { roomId }
) => {
  router.currentPage = { name: "Room", roomId };
};

// TODO not sure exactly how to define setPage operator so that I can inject
// roomId
// export const goToRoom: Operator<{ roomId: string }> = action(
//   (context, { roomId }) => {
//     o.setPage({ name: "Room", roomId })(context, null);
//   }
// );
