import { RoomKey } from "@wlq/wlq-core/lib/model";
import { resolveCodecEither } from "@wlq/wlq-core";
import { GetTokenResponseCodec } from "@wlq/wlq-core/lib/api/token/GetTokenResponse";
import axios from "axios";

const rest = (() => {
  let instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_REST_BASE_URL
  });

  return {
    async getToken() {
      const { data } = await instance.get("getToken");
      return resolveCodecEither(GetTokenResponseCodec.decode(data));
    },
    getRoom({ roomId }: RoomKey) {
      return instance.post("getRoom", { roomId });
    },
    setAuthorization(token: string) {
      instance.defaults.headers = { Authorization: `Bearer ${token}` };
    }
  };
})();
export default rest;
