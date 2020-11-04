import {
  getIndefiniteArticle,
  sample,
  sampleMany,
  shuffleArray
} from "../../../helpers";
import { PosedQuestion } from "../../game/PosedQuestion";
import { CollectionItem } from "../Collection";
import { TaggedCollection } from "../TaggedCollection";

const poseTaggedQuestion = ({
  items,
  questions
}: TaggedCollection): PosedQuestion => {
  const tagNames = items.map(item => item.tags).flat(); // TODO info
  const { type, questionTextTemplate } = sample(questions);
  const isPositive = type === "TaggedPositive";

  const getItems = (tag: string, withTag: boolean) =>
    items.filter(item =>
      withTag ? item.tags.includes(tag) : !item.tags.includes(tag)
    );

  let target: string;
  let possibleWrongs: CollectionItem[] = [];
  while (possibleWrongs.length < 3) {
    target = sample(tagNames);
    possibleWrongs = getItems(target, isPositive ? false : true);
  }

  const answer = sample(getItems(target!, isPositive ? true : false));
  const options = shuffleArray([answer, ...sampleMany(possibleWrongs, 3)]);

  return {
    type: "PosedQuestion",
    questionText: renderTagQuestionTemplate(questionTextTemplate, target!),
    options: options.map(option => option.name),
    answer: answer.name,
    time: parseInt(process.env.GAME_QUESTION_TIME!)
  };
};
export default poseTaggedQuestion;

const renderTagQuestionTemplate = (template: string, tag: string) =>
  template
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${tag}", tag)
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${tagIndefiniteArticle}", getIndefiniteArticle(tag));
