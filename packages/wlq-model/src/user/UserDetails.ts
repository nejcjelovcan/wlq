import { ValidationError, Validator } from '../validation'

export interface UserDetails {
  alias: string
  emoji: string
  color: string
}

export const USER_DETAILS_EMOJIS = [
  '🐵',
  '🐶',
  '🦊',
  '🐱',
  '🦁',
  '🐯',
  '🦄',
  '🐮',
  '🐷',
  '🐭',
  '🐹',
  '🐰',
  '🐻',
  '🐨',
  '🐼',
  '🐦',
  '🐧',
  '🐸',
  '🐠',
  '🐡',
  '🐙',
]

export const USER_DETAILS_COLORS = [
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'blue',
  'teal',
  'green',
  'cyan',
]

export const validateUserDetails: Validator<UserDetails> = obj => {
  if (
    typeof obj.alias !== 'string' ||
    obj.alias.length < 1 ||
    obj.alias.length > 30
  ) {
    throw new ValidationError(
      'alias',
      'Alias must be between 1 and 30 characters',
    )
  }
  if (!USER_DETAILS_COLORS.includes(obj.color))
    throw new ValidationError('color', 'Invalid color')
  if (!USER_DETAILS_EMOJIS.includes(obj.emoji))
    throw new ValidationError('emoji', 'Invalid emoji')
  return { alias: obj.alias, color: obj.color, emoji: obj.emoji }
}
