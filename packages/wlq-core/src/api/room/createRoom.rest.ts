import * as t from "io-ts";
import IEmitter from "../../emitter/IEmitter";
import resolveCodecEither from "../../helpers/resolveCodecEither";

import IStore from "../../model/IStore";
import newRoom, { NewRoomCodec } from "../../model/room/newRoom";
import {
  ErrorResponse,
  getErrorMessage,
  getErrorMessageStatusCode
} from "../error.helpers";
import IWlqRawEvent from "../IWlqRawEvent";
import { GetRoomResponse } from "./getRoom.rest";

export default async function createRoom(
  event: IWlqRawEvent,
  store: Pick<IStore, "addRoom">,
  emitter: Pick<IEmitter, "restResponse">
) {
  try {
    const request = resolveCodecEither(
      CreateRoomRequestCodec.decode(event.payload)
    );
    let room = newRoom(request);
    room = await store.addRoom(room);

    await emitter.restResponse<GetRoomResponse>({
      statusCode: 200,
      payload: { room }
    });
  } catch (e) {
    await emitter.restResponse<ErrorResponse>({
      statusCode: getErrorMessageStatusCode(e),
      payload: { error: getErrorMessage(e) }
    });
  }
}

export const CreateRoomRequestCodec = NewRoomCodec;
export type CreateRoomRequest = t.TypeOf<typeof CreateRoomRequestCodec>;
