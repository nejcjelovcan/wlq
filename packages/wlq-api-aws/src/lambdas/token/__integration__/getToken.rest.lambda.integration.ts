describe("getToken.rest.lambda", () => {
  it("GET request returns a token", async () => {
    const response = await fetch(`${process.env.API_BASE}/getToken`);
    const data = await response.json();
    expect(data).toEqual({ token: "ladida" });
  });
});
