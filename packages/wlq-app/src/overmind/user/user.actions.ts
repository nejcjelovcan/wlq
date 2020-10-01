import { AsyncAction, Action } from 'overmind'
import { GetTokenResponseData } from '@wlq/wlq-api/src/user/getToken'
import UserDetails, {
  validateUserDetails,
} from '@wlq/wlq-model/src/user/UserDetails'

export const getToken: AsyncAction = async ({
  state: { user },
  effects: { api },
}) => {
  if (!user.getTokenState.loading) {
    user.getTokenState = { loading: true }

    try {
      user.token = (await api.apiGet<GetTokenResponseData>('/getToken')).token
    } catch (e) {
      user.getTokenState.error = e.message
    } finally {
      user.getTokenState.loading = false
    }
  }
}

export const clearUserData: Action = ({
  state: { user },
  effects: { localStorage },
}) => {
  user.details = undefined
  user.detailsValid = false
  user.token = undefined
  user.getTokenState = {}
  localStorage.clear()
}

export const setUserDetails: Action<Partial<UserDetails>> = (
  { state: { user }, effects: { localStorage } },
  userDetails,
) => {
  user.details = userDetails
  user.detailsValid = validateUserDetails(userDetails)
  if (user.detailsValid) {
    localStorage.setItemJson('userDetails', user.details)
  }
}
