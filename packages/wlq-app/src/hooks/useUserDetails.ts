import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useOvermind } from '../overmind'

const useUserDetails = (redirect = false) => {
  const {
    state: {
      user: { details, detailsValid },
    },
  } = useOvermind()

  const router = useRouter()

  useEffect(() => {
    if (!detailsValid && redirect) {
      router.replace(
        `/user/?next=${encodeURIComponent(
          document.location.pathname + document.location.search,
        )}`,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsValid])

  return detailsValid ? details : undefined
}
export default useUserDetails
