import { Collection, CollectionItem } from './Collection'
import { Question } from './Question'

export interface RankedCollection extends Collection {
  type: 'RankedCollection'
  questions: RankedCollectionQuestion[]
}

export interface RankedCollectionItem extends CollectionItem {
  type: 'RankedCollectionItem'
  rank: number
  quantity: number | string
}

export interface RankedCollectionQuestion extends Question {
  type: 'RankedBottom' | 'RankedLeast' | 'RankedMost' | 'RankedTop'
}
