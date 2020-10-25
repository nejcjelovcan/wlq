import * as t from "io-ts";
import {
  ErrorResponse,
  getErrorMessage,
  getErrorStatusCode,
  IEmitter,
  IStore,
  IWlqRawEvent,
  resolveCodecEither
} from "../..";
import { getRoomPublic, newRoom, NewRoomCodec } from "../../model";
import { GetRoomResponse } from "./getRoom.rest";

export default async function createRoom(
  event: IWlqRawEvent,
  store: Pick<IStore, "addRoom">,
  emitter: Pick<IEmitter, "restResponse">
) {
  try {
    const payload = resolveCodecEither(
      CreateRoomRequestCodec.decode(event.payload)
    );
    let room = newRoom(payload);
    room = await store.addRoom(room);

    emitter.restResponse<GetRoomResponse>({
      statusCode: 200,
      payload: { room: getRoomPublic(room) }
    });
  } catch (e) {
    emitter.restResponse<ErrorResponse>({
      statusCode: getErrorStatusCode(e),
      payload: { error: getErrorMessage(e) }
    });
  }
}

export const CreateRoomRequestCodec = NewRoomCodec;
export type CreateRoomRequest = t.TypeOf<typeof CreateRoomRequestCodec>;
