import * as t from "io-ts";
import { Room } from "./Room";
import { nanoid } from "nanoid";

const NewRoomProps = {
  listed: t.boolean
};

export const NewRoomType = t.type(NewRoomProps);
export type NewRoom = t.TypeOf<typeof NewRoomType>;

export default function newRoom(newRoom: NewRoom): Room {
  return {
    type: "Room",
    roomId: nanoid(),
    listed: newRoom.listed,
    state: "Idle",
    participantCount: 0
  };
}
