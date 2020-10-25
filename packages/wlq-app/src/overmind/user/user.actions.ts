// import { GetTokenResponseData } from '@wlq/wlq-api/src/user'
// import {
//   sample,
//   UserDetails,
//   USER_DETAILS_COLORS,
//   USER_DETAILS_EMOJIS,
//   validateUserDetails,
// } from '@wlq/wlq-model/src'
import { Action } from "overmind";

// export const getToken: AsyncAction = async ({
//   state: { user },
//   effects: { api, localStorage },
// }) => {
//   if (!user.getTokenRequest.loading) {
//     user.getTokenRequest = { loading: true }

//     try {
//       const data = await api.apiGet<GetTokenResponseData>('getToken')
//       user.token = data.token
//       localStorage.setItem('token', user.token)
//     } catch (e) {
//       user.getTokenRequest.error = e.message
//     } finally {
//       user.getTokenRequest.loading = false
//     }
//   }
// }

// export const clearUserData: Action = ({ state, effects: { localStorage } }) => {
//   state.user = { getTokenRequest: {} }
//   localStorage.clear()
// }

// export const setUserDetails: Action<Partial<UserDetails>> = (
//   { state: { user }, effects: { localStorage } },
//   userDetails,
// ) => {
//   user.details = userDetails
//   try {
//     user.details = validateUserDetails(userDetails)
//     user.detailsValid = true
//   } catch (e) {
//     user.detailsValid = false
//   }

//   if (user.detailsValid) {
//     localStorage.setItemJson('userDetails', user.details)
//   }
// }

// export const getUserDetails: Action<void, Partial<UserDetails> | undefined> = ({
//   state: { user },
//   effects: { localStorage },
// }) => {
//   if (user.detailsChecked) return user.details

//   const userDetails = localStorage.getItemJson('userDetails')
//   if (userDetails) {
//     user.details = userDetails
//   } else {
//     user.details = {
//       color: user.details?.color ?? sample(USER_DETAILS_COLORS),
//       emoji: user.details?.emoji ?? sample(USER_DETAILS_EMOJIS),
//     }
//   }
//   try {
//     validateUserDetails(userDetails)
//     user.detailsValid = true
//   } catch (e) {
//     user.detailsValid = false
//   }
//   user.detailsChecked = true
//   return user.details
// }
export const test: Action = () => {};
