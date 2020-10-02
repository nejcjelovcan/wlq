import { useEffect } from 'react'
import { useOvermind } from '../overmind'

const useToken = (retry = false) => {
  const {
    state: {
      user: {
        token,
        getTokenRequest: { error },
      },
    },
    actions: {
      user: { getToken },
    },
  } = useOvermind()

  useEffect(() => {
    // TODO don't know about this retry mechanism...
    if (!token && (!error || retry)) {
      getToken()
    }
  }, [token, error, retry, getToken])

  return token
}
export default useToken
