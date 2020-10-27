import * as t from "io-ts";
import {
  ErrorResponse,
  getErrorMessage,
  getErrorStatusCode,
  IEmitter,
  IStore,
  IWlqRawEvent,
  decodeThrow
} from "../..";
import {
  getRoomPublic,
  RoomKeyCodec,
  RoomPublicCodec
} from "../../model/room/Room";

export default async function getRoom(
  event: IWlqRawEvent,
  store: Pick<IStore, "getRoom">,
  emitter: Pick<IEmitter, "restResponse">
) {
  try {
    const payload = decodeThrow(RoomKeyCodec, event.payload);
    const room = await store.getRoom(payload);

    emitter.restResponse<GetRoomResponse>({
      statusCode: 200,
      payload: { room: getRoomPublic(room) }
    });
  } catch (e) {
    console.error("getRoom error");
    console.log(e);
    emitter.restResponse<ErrorResponse>({
      statusCode: getErrorStatusCode(e),
      payload: { error: getErrorMessage(e) }
    });
  }
}

export const GetRoomResponseCodec = t.type({
  room: RoomPublicCodec
});
export type GetRoomResponse = t.TypeOf<typeof GetRoomResponseCodec>;
