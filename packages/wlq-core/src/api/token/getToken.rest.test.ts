import getToken from "./getToken.rest";

describe("getToken.rest", () => {
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
