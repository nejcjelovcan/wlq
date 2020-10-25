import { AxiosRequestConfig } from "axios";
import { axios, getTokenConfig } from "../../../__integration__/utils";

describe("createRoom", () => {
  let tokenConfig: AxiosRequestConfig;
  beforeAll(async done => {
    tokenConfig = await getTokenConfig();
    done();
  });

  it("POST responds 401 if no authorization header provided", async () => {
    await expect(axios.post("createRoom")).rejects.toMatchObject({
      response: {
        data: { message: "Unauthorized" },
        status: 401
      }
    });
  });

  it("POST responds 400 if no listed parameter provided", async () => {
    await expect(
      axios.post("createRoom", {}, tokenConfig)
    ).rejects.toMatchObject({
      response: {
        data: { error: /Invalid value/ },
        status: 400
      }
    });
  });

  it("POST responds 200 with room data if parameters provided", async () => {
    const response = await axios.post(
      "createRoom",
      { listed: false },
      tokenConfig
    );
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      room: { type: "Room", listed: false, participantCount: 0, state: "Idle" }
    });
  });
});
