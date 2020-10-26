import { Operator, pipe } from "overmind";
import * as o from "./token.operators";

export const assureToken: Operator = pipe(
  o.loadToken(),
  o.shouldRequestToken(),
  o.requestToken(),
  o.writeToken(),
  o.handleTokenError()
);
