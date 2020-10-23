import * as t from "io-ts";
import { RoomCodec } from "../../model/room/Room";

export const GetRoomResponseCodec = t.type({
  room: RoomCodec
});
export type GetRoomResponse = t.TypeOf<typeof GetRoomResponseCodec>;
