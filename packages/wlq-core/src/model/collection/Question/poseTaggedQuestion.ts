import { PosedQuestion } from ".";
import {
  getIndefiniteArticle,
  sample,
  sampleMany,
  shuffleArray
} from "../../../helpers";
import { TaggedCollection } from "../TaggedCollection";

const poseTaggedQuestion = ({
  items,
  questions
}: TaggedCollection): PosedQuestion => {
  const tagNames = items.map(item => item.tags).flat(); // TODO info
  const { type, questionTextTemplate } = sample(questions);

  const targetTag = sample(tagNames);

  const itemsWithTag = items.filter(item => item.tags.includes(targetTag));
  const itemsWithoutTag = items.filter(item => !item.tags.includes(targetTag));

  const isPositive = type === "TaggedPositive";
  let answer = sample(isPositive ? itemsWithTag : itemsWithoutTag);
  let options = shuffleArray([
    answer,
    ...sampleMany(isPositive ? itemsWithoutTag : itemsWithTag, 3)
  ]);
  return {
    questionText: renderTagQuestionTemplate(questionTextTemplate, targetTag),
    options,
    answer
  };
};
export default poseTaggedQuestion;

const renderTagQuestionTemplate = (template: string, tag: string) =>
  template
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${tag}", tag)
    // eslint-disable-next-line no-template-curly-in-string
    .replace("${tagIndefiniteArticle}", getIndefiniteArticle(tag));
