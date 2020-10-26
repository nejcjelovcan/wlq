import { Operator } from "overmind";
import * as o from "./router.operators";

export const showIndexPage: Operator = o.setPage({ name: "index" });
