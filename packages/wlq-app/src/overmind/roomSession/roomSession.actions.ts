import { RoomKey, RoomPublic } from "@wlq/wlq-core/lib/model";
import { Operator } from "overmind";
import * as o from "./roomSession.operators";

export const requestRoom: Operator<RoomKey> = o.requestRoom();
export const setRoom: Operator<RoomPublic> = o.setRoom();
