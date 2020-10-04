import { PosedQuestion } from '.'
import { sample, sampleMany, shuffleArray } from '../../helpers'
import { RankedCollection, RankedCollectionItem } from '../RankedCollection'

const poseRankedQuestion = ({
  items,
  questions,
}: RankedCollection): PosedQuestion<RankedCollectionItem> => {
  const { type, questionTextTemplate } = sample(questions)

  let answer: RankedCollectionItem
  let possibleWrongs: RankedCollectionItem[]

  switch (type) {
    case 'RankedLeast':
      answer = sample(items.slice(3))
      possibleWrongs = items.slice(0, answer.rank - 1)
      break
    case 'RankedMost':
      answer = sample(items.slice(0, items.length - 3))
      possibleWrongs = items.slice(answer.rank)
      break
    default:
      throw new Error(
        `Unrecognized question type for RankedCollection: ${type}`,
      )
  }

  let options = shuffleArray([answer, ...sampleMany(possibleWrongs, 3)])

  return {
    questionText: questionTextTemplate,
    options,
    answer,
  }
}
export default poseRankedQuestion
