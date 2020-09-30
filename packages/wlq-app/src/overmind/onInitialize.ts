import { OnInitialize } from 'overmind'
import { validateUserDetails } from '@wlq/wlq-model/src/user/UserDetails'

export const onInitialize: OnInitialize = async ({
  state: { user },
  effects: { localStorage },
}) => {
  const token = localStorage.getItem('token')
  if (token) user.token = token

  const userDetails = localStorage.getItemJson('userDetails')
  if (userDetails && validateUserDetails(userDetails)) {
    user.details = userDetails
    user.detailsValid = true
  }
}
