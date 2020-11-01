import { sample, sampleMany, shuffleArray } from "../../../helpers";
import { PosedQuestion } from "../../game/PosedQuestion";
import { RankedCollection, RankedCollectionItem } from "../RankedCollection";

const poseRankedQuestion = ({
  items,
  questions
}: RankedCollection): PosedQuestion => {
  const { type, questionTextTemplate } = sample(questions);

  let answer: RankedCollectionItem;
  let possibleWrongs: RankedCollectionItem[];

  switch (type) {
    case "RankedLeast":
      answer = sample(items.slice(3));
      possibleWrongs = items.slice(0, answer.rank - 1);
      break;
    case "RankedMost":
      answer = sample(items.slice(0, items.length - 3));
      possibleWrongs = items.slice(answer.rank - 1);
      break;
  }
  const options = shuffleArray([answer, ...sampleMany(possibleWrongs, 3)]);

  return {
    type: "PosedQuestion",
    questionText: questionTextTemplate,
    options: options.map(option => option.name),
    answer: answer.name,
    time: parseInt(process.env.GAME_QUESTION_TIME!)
  };
};
export default poseRankedQuestion;
