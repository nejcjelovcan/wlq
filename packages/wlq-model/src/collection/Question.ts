export default interface Question {
  // type: QuestionType // TODO
  type: string
  questionTextTemplate: string
  helpTextTemplate?: string
}

// export enum QuestionType {
//   TaggedPositive = 'TaggedPositive',
//   TaggedNegative = 'TaggedNegative',
//   RankedMost = 'RankedMost',
//   RankedLeast = 'RankedList',
//   RankedTop = 'RankedTop',
//   RankedBottom = 'RankedBottom',
// }
