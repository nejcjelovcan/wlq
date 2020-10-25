import { axios } from "../../../__integration__/utils";

describe("getToken", () => {
  it("GET responds 200 with token", async () => {
    const response = await axios.get("getToken");
    expect(response.status).toBe(200);
    expect(response.data.token).toMatch(/[^.]+\.[^.]+\.[^.]/);
  });
});
