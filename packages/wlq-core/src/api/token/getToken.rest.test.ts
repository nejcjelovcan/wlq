import getToken from "./getToken.rest";

describe("getToken.rest", () => {
  process.env.API_OCT_SECRET_KEY = "test";

  it("calls restResponse exactly once with a new token", () => {
    const emitter = {
      restResponse: jest.fn()
    };

    getToken(emitter);

    const calls = emitter.restResponse.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toMatchObject({ statusCode: 200 });
    expect(calls[0][0].payload.token).toMatch(/[^.]+\.[^.]+\.[^.]/);
  });
});
