import * as e from "fp-ts/Either";
import { map, Operator, pipe } from "overmind";
import { fold, getFromLocalStorage, writeToLocalStorage } from "../operators";
import * as o from "./token.operators";

export const assureToken: Operator = pipe(
  getFromLocalStorage("token"),
  fold({
    success: o.setToken(),
    error: pipe(
      o.sendRequest(),
      map(async ({ effects: { rest } }) => {
        try {
          return e.right((await rest.getToken()).token);
        } catch (error) {
          return e.left(error);
        }
      }),
      fold({
        success: pipe(
          o.sendReceive(),
          o.setToken(),
          writeToLocalStorage("token")
        ),
        error: o.sendError()
      })
    )
  })
);
