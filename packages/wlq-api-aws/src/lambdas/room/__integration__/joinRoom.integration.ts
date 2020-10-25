import { newWebsocketClient } from "../../../__integration__/utils";

describe("joinRoom", () => {
  // let tokenConfig: AxiosRequestConfig;
  // let tokenConfig2: AxiosRequestConfig;
  // beforeAll(async done => {
  //   tokenConfig = await getTokenConfig();
  //   tokenConfig2 = await getTokenConfig();
  //   done();
  // });

  it("emits error message on invalid payload", done => {
    expect.assertions(1);
    const client = newWebsocketClient(
      () => {},
      e => {
        console.log("MESSAGE!", e);
        client.close();
        done();
      }
    );
  });

  // it("POST responds 400 if no listed parameter provided", async () => {
  //   await expect(
  //     axios.post("createRoom", {}, tokenConfig)
  //   ).rejects.toMatchObject({
  //     response: {
  //       data: { error: /Invalid value/ },
  //       status: 400
  //     }
  //   });
  // });

  // it("POST responds 200 with room data if parameters provided", async () => {
  //   const response = await axios.post(
  //     "createRoom",
  //     { listed: false },
  //     tokenConfig
  //   );
  //   expect(response.status).toBe(200);
  //   expect(response.data).toMatchObject({
  //     room: { type: "Room", listed: false, participantCount: 0, state: "Idle" }
  //   });
  // });
});
