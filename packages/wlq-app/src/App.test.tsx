import { render } from "@testing-library/react";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { Provider } from "overmind-react";
import React from "react";
import App from "./App";
import { config } from "./overmind";
import { withEffectMocks } from "./__test__/overmindMocks";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <Provider value={createOvermindMock(config)}>
        <App />
      </Provider>
    );
  });
  it("renders without crashing (with user details)", async () => {
    const overmind = createOvermindMock(config, withEffectMocks());
    await overmind.actions.user.updateDetails(userDetailsFixture());
    render(
      <Provider value={overmind}>
        <App />
      </Provider>
    );
  });
});
