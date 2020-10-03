import { UserDetails } from '@wlq/wlq-model/src/user'
import { RequestState } from '../../utils/api'

export type UserState = {
  token?: string
  getTokenRequest: RequestState
  details?: Partial<UserDetails>
  detailsValid?: boolean
  detailsChecked?: boolean
}

export const state: UserState = {
  getTokenRequest: {},
}
