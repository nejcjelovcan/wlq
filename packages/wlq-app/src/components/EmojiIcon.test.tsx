import React from "react";
import EmojiIcon from "./EmojiIcon";
import { render } from "@testing-library/react";

describe("EmojiIcon", () => {
  it("Displays emoji as text", () => {
    const { getByText } = render(<EmojiIcon emoji="🔮" variant="vibrant" />);
    expect(getByText("🔮")).toBeInTheDocument();
  });
});
