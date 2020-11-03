import { fireEvent, render } from "@testing-library/react";
import {
  participantPublicFixture,
  posedQuestionFixture,
  userDetailsFixture
} from "@wlq/wlq-core/lib/model/fixtures";
import { createOvermindMock } from "overmind";
import { Provider } from "overmind-react";
import React from "react";
import UserDetailsContext from "../../../../contexts/UserDetailsContext";
import { config } from "../../../../overmind";
import QuestionView from "./QuestionView";

describe("QuestionView", () => {
  it("displays questionText and options when current=Question", () => {
    const { getByText } = render(
      <Provider value={createOvermindMock(config)}>
        <QuestionView
          answerQuestion={() => {}}
          current="Question"
          question={posedQuestionFixture({
            questionText: "Question text",
            options: ["Option 1", "Option 2"]
          })}
          participantsByAnswer={{}}
        />
      </Provider>
    );
    expect(getByText("Question text")).toBeInTheDocument();
    expect(getByText("Option 1")).toBeInTheDocument();
    expect(getByText("Option 2")).toBeInTheDocument();
  });
  it("calls answerQuestion callback when option is clicked", () => {
    const answerQuestion = jest.fn();
    const { getByText } = render(
      <Provider value={createOvermindMock(config)}>
        <QuestionView
          answerQuestion={answerQuestion}
          current="Question"
          question={posedQuestionFixture({
            questionText: "Question text",
            options: ["Option 1", "Option 2"]
          })}
          participantsByAnswer={{}}
        />
      </Provider>
    );
    fireEvent.click(getByText("Option 1"));
    expect(answerQuestion.mock.calls.length).toBe(1);
  });
  it("displays question text when current=Answer", () => {
    const { getByText } = render(
      <Provider value={createOvermindMock(config)}>
        <UserDetailsContext.Provider value={userDetailsFixture()}>
          <QuestionView
            answerQuestion={() => {}}
            current="Answer"
            question={posedQuestionFixture({
              questionText: "Question text",
              options: ["Option 1", "Option 2"]
            })}
            userAnswer="Option 1"
            participantsByAnswer={{}}
          />
        </UserDetailsContext.Provider>
      </Provider>
    );
    expect(getByText("Question text")).toBeVisible();
  });
  it("displays UserBadge by the question they answered", () => {
    const { getByTestId } = render(
      <Provider value={createOvermindMock(config)}>
        <UserDetailsContext.Provider value={userDetailsFixture()}>
          <QuestionView
            answerQuestion={() => {}}
            current="Answer"
            question={posedQuestionFixture({
              questionText: "Question text",
              options: ["Option 1", "Option 2"]
            })}
            userAnswer="Option 1"
            participantsByAnswer={{
              "Option 1": [
                participantPublicFixture({
                  pid: "testpid",
                  details: userDetailsFixture({ emoji: "🐧" })
                })
              ]
            }}
          />
        </UserDetailsContext.Provider>
      </Provider>
    );
    const badge = getByTestId("Option 1-testpid");
    expect(badge).toBeVisible();
    expect(badge).toHaveTextContent("🐧");
  });
});
