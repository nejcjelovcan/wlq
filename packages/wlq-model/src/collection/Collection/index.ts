import { Question } from '../Question'

export interface Collection<I extends CollectionItem = CollectionItem> {
  type: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questions: Question[]
  sourceUrl: string
  description?: string
  items: I[]
}

export interface CollectionItem {
  name: string
  type: string
  sets: string[]
  info?: string
}

export interface CollectionInfo {
  itemsLength: number
}

export { default as getCollectionInfo } from './getCollectionInfo'
export { default as filterCollectionItemsBySets } from './filterCollectionItemsBySets'
export { default as shakeOffCollection } from './shakeOffCollection'
