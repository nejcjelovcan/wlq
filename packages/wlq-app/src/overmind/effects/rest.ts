import { NewRoom, RoomKey } from "@wlq/wlq-core/lib/model";
import { resolveCodecEither } from "@wlq/wlq-core";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/GetTokenResponse";
import { GetRoomResponseCodec } from "@wlq/wlq-core/lib/api/room/getRoom.rest";
import axios from "axios";

const rest = (() => {
  let instance = axios.create({
    baseURL: process.env.REACT_APP_REST_BASE_URL
  });

  return {
    async getToken() {
      const { data } = await instance.get("getToken");
      return resolveCodecEither(GetTokenResponseCodec.decode(data));
    },
    async getRoom({ roomId }: RoomKey) {
      const { data } = await instance.post("getRoom", { roomId });
      return resolveCodecEither(GetRoomResponseCodec.decode(data));
    },
    async createRoom(newRoom: NewRoom) {
      const { data } = await instance.post("createRoom", newRoom);
      return resolveCodecEither(GetRoomResponseCodec.decode(data));
    },
    setAuthorization(token: string) {
      instance.defaults.headers = { Authorization: `Bearer ${token}` };
    }
  };
})();
export default rest;
