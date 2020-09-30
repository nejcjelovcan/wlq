import UserDetails from '@wlq/wlq-model/src/user/UserDetails'
import { RequestState } from '../../utils/api'

export type UserState = {
  token?: string
  getTokenState: RequestState
  details?: Partial<UserDetails>
  detailsValid?: boolean
}

export const state: UserState = {
  getTokenState: {},
}
