import React from "react";
import UserBadge from "./UserBadge";
import { render } from "@testing-library/react";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";

describe("UserBadge", () => {
  it("Displays emoji", () => {
    const { getByText } = render(
      <UserBadge userDetails={userDetailsFixture({ emoji: "🐭" })} />
    );
    expect(getByText("🐭")).toBeInTheDocument();
  });
  it("Displays alias by default", () => {
    const { getByText } = render(
      <UserBadge userDetails={userDetailsFixture({ alias: "Alias" })} />
    );
    expect(getByText("Alias")).toBeInTheDocument();
  });
  it("Does not display alias if showAlias=false", () => {
    const { baseElement } = render(
      <UserBadge
        userDetails={userDetailsFixture({ alias: "Alias" })}
        showAlias={false}
      />
    );
    expect(baseElement).not.toContain("Alias");
  });
});
