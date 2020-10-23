import poseRankedQuestion from "./poseRankedQuestion";
import {
  rankedCollectionFixture,
  rankedCollectionItemFixture
} from "../RankedCollection/__fixtures__/rankedCollection.fixtures";
import { RankedCollection } from "../RankedCollection";

const collectionWithFourItems = (props: Partial<RankedCollection> = {}) =>
  rankedCollectionFixture({
    items: [
      rankedCollectionItemFixture({ rank: 1 }),
      rankedCollectionItemFixture({ rank: 2 }),
      rankedCollectionItemFixture({ rank: 3 }),
      rankedCollectionItemFixture({ rank: 4 })
    ],
    ...props
  });

describe("poseRankedQuestion", () => {
  it("returns posed question with 4 options for a given collection", () => {
    const posed = poseRankedQuestion(
      rankedCollectionFixture({
        questions: [
          {
            type: "RankedMost",
            questionTextTemplate: "Example question text"
          }
        ]
      })
    );
    expect(posed).toMatchObject({ questionText: "Example question text" });
    expect(posed.options.length).toBe(4);
  });
  it("sets answer to first item for RankedMost question if there are only 4 items", () => {
    const posed = poseRankedQuestion(
      collectionWithFourItems({
        questions: [
          { type: "RankedMost", questionTextTemplate: "Example question text" }
        ]
      })
    );
    expect(posed.answer.rank).toEqual(1);
  });
  it("sets answer to last item for RankedLeast question if there are only 4 items", () => {
    const posed = poseRankedQuestion(
      collectionWithFourItems({
        questions: [
          {
            type: "RankedLeast",
            questionTextTemplate: "Example question text"
          }
        ]
      })
    );
    expect(posed.answer.rank).toEqual(4);
  });
});
