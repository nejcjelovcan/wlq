import React from "react";
import PageHead from "./PageHead";
import { render } from "@testing-library/react";
import { userDetailsFixture } from "@wlq/wlq-core/lib/model/fixtures";
import UserDetailsContext from "../contexts/UserDetailsContext";

describe("PageHead", () => {
  it("Displays title as text", () => {
    const { getByText } = render(<PageHead title="Title" />);
    expect(getByText("Title")).toBeInTheDocument();
  });
  it("Displays user details emoji if userDetails context provided", () => {
    const { getByText } = render(
      <UserDetailsContext.Provider value={userDetailsFixture()}>
        <PageHead title="Title" />
      </UserDetailsContext.Provider>
    );
    expect(getByText("🐭")).toBeInTheDocument();
  });
  it("Displays alias if userDetails context provided", () => {
    const { getByText } = render(
      <UserDetailsContext.Provider value={userDetailsFixture()}>
        <PageHead title="Title" showAlias />
      </UserDetailsContext.Provider>
    );
    expect(getByText("Alias")).toBeInTheDocument();
  });
  it("Does not display alias if userDetails provided and showAlias=false", () => {
    const { baseElement } = render(
      <UserDetailsContext.Provider value={userDetailsFixture()}>
        <PageHead title="Title" showAlias={false} />
      </UserDetailsContext.Provider>
    );
    expect(baseElement).not.toContain("Alias");
  });
});
