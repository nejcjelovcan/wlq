export default interface UserDetails {
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

export const validateUserDetails = (obj: { [key: string]: any }): boolean => {
  if (
    typeof obj.alias !== 'string' ||
    obj.alias.length < 1 ||
    obj.alias.length > 30
  ) {
    return false
  }
  if (!USER_DETAILS_COLORS.includes(obj.color)) return false
  if (!USER_DETAILS_EMOJIS.includes(obj.emoji)) return false
  return true
}
