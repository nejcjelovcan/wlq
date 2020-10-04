import { CollectionItem } from '../Collection'

export interface Question {
  type: string
  questionTextTemplate: string
  helpTextTemplate?: string
}

export interface PosedQuestion<I extends CollectionItem = CollectionItem> {
  questionText: string
  options: I[]
  answer: I
}
