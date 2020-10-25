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
import { RoomCodec, RoomKeyCodec } from "../../model/room/Room";

export default async function getRoom(
  event: IWlqRawEvent,
  store: Pick<IStore, "getRoom">,
  emitter: Pick<IEmitter, "restResponse">
) {
  try {
    const payload = resolveCodecEither(RoomKeyCodec.decode(event.payload));
    const room = await store.getRoom(payload);

    emitter.restResponse<GetRoomResponse>({
      statusCode: 200,
      payload: { room }
    });
  } catch (e) {
    emitter.restResponse<ErrorResponse>({
      statusCode: getErrorStatusCode(e),
      payload: { error: getErrorMessage(e) }
    });
  }
}

export const GetRoomResponseCodec = t.type({
  room: RoomCodec
});
export type GetRoomResponse = t.TypeOf<typeof GetRoomResponseCodec>;