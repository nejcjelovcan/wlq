import { AsyncAction, Action } from 'overmind'
import { GetTokenResponseData } from '@wlq/wlq-api/src/user/getToken'
import UserDetails, {
  USER_DETAILS_COLORS,
  USER_DETAILS_EMOJIS,
  validateUserDetails,
} from '@wlq/wlq-model/src/user/UserDetails'
import { sample } from '@wlq/wlq-model/src/helpers'

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

export const getUserDetails: Action<void, Partial<UserDetails> | undefined> = ({
  state: { user },
  effects: { localStorage },
}) => {
  if (user.detailsChecked) return user.details

  const userDetails = localStorage.getItemJson('userDetails')
  if (userDetails && validateUserDetails(userDetails)) {
    user.details = userDetails
    user.detailsValid = true
  } else {
    user.details = {
      color: user.details?.color ?? sample(USER_DETAILS_COLORS),
      emoji: user.details?.emoji ?? sample(USER_DETAILS_EMOJIS),
    }
  }
  user.detailsChecked = true
  return user.details
}
