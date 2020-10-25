import { AxiosRequestConfig } from "axios";
import { axios, getTokenConfig } from "../../../__integration__/utils";

describe("getRoom", () => {
  let tokenConfig: AxiosRequestConfig;
  beforeAll(async done => {
    tokenConfig = await getTokenConfig();
    done();
  });

  it("POST responds 401 if no authorization header provided", async () => {
    await expect(axios.post("getRoom")).rejects.toMatchObject({
      response: {
        data: { message: "Unauthorized" },
        status: 401
      }
    });
  });

  it("POST responds 400 if no roomId parameter provided", async () => {
    await expect(axios.post("getRoom", {}, tokenConfig)).rejects.toMatchObject({
      response: {
        data: {
          error:
            "Invalid value undefined supplied to : { roomId: string }/roomId: string"
        },
        status: 400
      }
    });
  });

  it("POST responds 404 if room does not exist", async () => {
    await expect(
      axios.post("getRoom", { roomId: "nonexistent" }, tokenConfig)
    ).rejects.toMatchObject({
      response: {
        data: { error: "Room not found" },
        status: 404
      }
    });
  });

  it("POST responds 200 with room data if room exists", async () => {
    const {
      room: { roomId }
    } = (await axios.post("createRoom", { listed: true }, tokenConfig)).data;

    const response = await axios.post("getRoom", { roomId }, tokenConfig);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      room: {
        type: "Room",
        listed: true,
        participantCount: 0,
        state: "Idle"
      }
    });
  });
});
