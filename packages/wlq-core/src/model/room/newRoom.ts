import * as t from "io-ts";
import { Room } from "./Room";
import { nanoid } from "nanoid";

export const NewRoomCodec = t.type({ listed: t.boolean });
export type NewRoom = t.TypeOf<typeof NewRoomCodec>;

export default function newRoom(newRoom: NewRoom): Room {
  return {
    type: "Room",
    roomId: nanoid(),
    listed: newRoom.listed,
    state: "Idle",
    participantCount: 0
  };
}
