import { Operator, pipe } from "overmind";
import * as o from "./token.operators";

export const assureToken: Operator = pipe(
  o.loadToken(),
  o.setupRestAuthorization(),
  o.shouldRequestToken(),
  o.requestToken(),
  o.writeToken(),
  o.setupRestAuthorization(),
  o.handleTokenError()
);
