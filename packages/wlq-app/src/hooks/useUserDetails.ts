import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useOvermind } from '../overmind'

const useUserDetails = (redirect = false) => {
  const {
    state: {
      user: { details, detailsValid, detailsChecked },
    },
    actions: {
      user: { getUserDetails },
    },
  } = useOvermind()

  const router = useRouter()

  useEffect(() => {
    if (!detailsChecked) getUserDetails()
  }, [detailsChecked, getUserDetails])

  useEffect(() => {
    if (detailsChecked && !detailsValid && redirect) {
      router.replace(
        `/user/?next=${encodeURIComponent(
          document.location.pathname + document.location.search,
        )}`,
      )
    }
  }, [detailsValid, detailsChecked, router, redirect])

  return detailsValid ? details : undefined
}
export default useUserDetails
