import poseTaggedQuestion from "./poseTaggedQuestion";
import { taggedCollectionFixture } from "../TaggedCollection/__fixtures__/taggedCollection.fixtures";

describe("poseTaggedQuestion", () => {
  it("returns posed question with 4 options for a given tagged collection (positive)", () => {
    const posed = poseTaggedQuestion(
      taggedCollectionFixture({
        questions: [
          {
            type: "TaggedPositive",
            questionTextTemplate: "Example question text"
          }
        ]
      })
    );
    expect(posed).toMatchObject({ questionText: "Example question text" });
    expect(posed.options.length).toBe(4);
  });
  it("returns posed question with 4 options for a given tagged collection (negative)", () => {
    const posed = poseTaggedQuestion(
      taggedCollectionFixture({
        questions: [
          {
            type: "TaggedNegative",
            questionTextTemplate: "Example question text"
          }
        ]
      })
    );
    expect(posed).toMatchObject({ questionText: "Example question text" });
    expect(posed.options.length).toBe(4);
  });
});
