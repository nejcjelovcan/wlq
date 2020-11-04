import React from "react";
import EmojiPicker from "./EmojiPicker";
import { fireEvent, render } from "@testing-library/react";
import { USER_DETAILS_EMOJIS } from "@wlq/wlq-core/lib/model";

describe("EmojiPicker", () => {
  it("displays emoji buttons", () => {
    const { getAllByRole } = render(<EmojiPicker setEmoji={() => {}} />);
    expect(getAllByRole("button").length).toBe(USER_DETAILS_EMOJIS.length);
  });
  it("calls setEmoji when button is clicked", () => {
    const setEmoji = jest.fn();
    const { getByText } = render(
      <EmojiPicker setEmoji={setEmoji} emoji="🐮" />
    );
    fireEvent.click(getByText("🐮"));
    expect(setEmoji.mock.calls.length).toBe(1);
    expect(setEmoji.mock.calls[0]).toEqual(["🐮"]);
  });
});
